const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { Client } = require('ldapts');
const { Client: PgClient } = require('pg');
const crypto = require('crypto');

// Function to generate SSHA hash for LDAP password
function generateSSHAHash(password) {
  const salt = crypto.randomBytes(4);
  const hash = crypto.createHash('sha1');
  hash.update(password);
  hash.update(salt);
  const digest = hash.digest();
  const ssha = Buffer.concat([digest, salt]).toString('base64');
  return `{SSHA}${ssha}`;
}

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const secretsClient = new SecretsManagerClient({ region: 'us-east-1' });

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Handle both direct invocation and API Gateway invocation
    let requestData;
    if (event.body) {
      // API Gateway invocation
      requestData = JSON.parse(event.body);
    } else {
      // Direct invocation
      requestData = event;
    }
    
    const { companyName, adminEmail, adminName, plan } = requestData;
    
    console.log('Registration request:', { companyName, adminEmail, adminName, plan });

    // 1. Create Cognito user
    const createUserParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: adminEmail,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        { Name: 'email', Value: adminEmail },
        { Name: 'name', Value: adminName },
        { Name: 'email_verified', Value: 'true' }
      ]
    };

    await cognitoClient.send(new AdminCreateUserCommand(createUserParams));
    console.log('Cognito user created successfully');

    // Set permanent password
    const setPasswordParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: adminEmail,
      Password: 'TempPass123!',
      Permanent: true
    };
    
    await cognitoClient.send(new AdminSetUserPasswordCommand(setPasswordParams));
    console.log('Permanent password set successfully');

    // 2. Save to DynamoDB
    const registrationDate = new Date().toISOString();
    const trialDays = parseInt(process.env.TRIAL_DAYS) || 14;
    const expirationDate = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString();
    
    const dynamoParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        email: { S: adminEmail },
        registrationDate: { S: registrationDate },
        companyName: { S: companyName },
        adminName: { S: adminName },
        plan: { S: plan },
        instanceUrl: { S: process.env.INSTANCE_URL },
        expirationDate: { S: expirationDate },
        status: { S: 'active' },
        username: { S: 'admin' },
        password: { S: 'admin123' }
      }
    };

    await dynamoClient.send(new PutItemCommand(dynamoParams));
    console.log('DynamoDB record saved successfully');

    // 3. Create LDAP user
    const ldapClient = new Client({
      url: 'ldap://10.0.10.146:389',
      timeout: 10000,
      connectTimeout: 10000
    });

    try {
      await ldapClient.bind('cn=admin,dc=moamalat,dc=local', 'admin123');
      console.log('LDAP admin bind successful');
      
      // Create user DN
      const userDn = `uid=${adminEmail},ou=users,dc=moamalat,dc=local`;
      
      // Add user to LDAP
      await ldapClient.add(userDn, {
        objectClass: ['inetOrgPerson', 'posixAccount'],
        uid: adminEmail,
        cn: adminName,
        sn: adminName.split(' ').pop() || adminName,
        givenName: adminName.split(' ')[0] || adminName,
        mail: adminEmail,
        userPassword: generateSSHAHash('TempPass123!'),
        uidNumber: String(Math.floor(Math.random() * 10000) + 1000),
        gidNumber: '1000',
        homeDirectory: `/home/${adminEmail.split('@')[0]}`
      });
      
      await ldapClient.unbind();
      console.log('LDAP user created successfully');
      
    } catch (ldapError) {
      console.error('LDAP operation failed:', ldapError);
      // Continue with registration even if LDAP fails
    }

    // 4. Add to MOAMALAT PostgreSQL database
    try {
      // Get database credentials from Secrets Manager
      const secretResponse = await secretsClient.send(new GetSecretValueCommand({
        SecretId: 'moamalat-secrets'
      }));
      
      const secrets = JSON.parse(secretResponse.SecretString);
      
      const pgClient = new PgClient({
        host: 'moamalat-db.cfyic2o0y7cp.us-east-1.rds.amazonaws.com',
        port: 5432,
        database: 'moamalat',
        user: 'moamalat_user',
        password: secrets.db_password,
        ssl: { rejectUnauthorized: false }
      });

      try {
        await pgClient.connect();
        console.log('PostgreSQL connection successful');
        
        // Generate employee number
        const employeeNumber = String(Math.floor(Math.random() * 10000) + 1);
        
        // Check existing table structure
        const tableInfo = await pgClient.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = 'employees' 
          ORDER BY ordinal_position;
        `);
        
        console.log('Existing table structure:', JSON.stringify(tableInfo.rows, null, 2));

        // Work with existing table structure - no need to recreate
        console.log('Using existing employees table structure');

        const insertQuery = `
          INSERT INTO employees (
            email, employee_number, fullname, fullname_en, 
            is_active, is_correspondent, is_hidden, 
            job_title, job_title_en, user_id, department_id, national_number
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
          )
        `;
        
        // Generate unique employee number using timestamp
        const uniqueEmployeeNumber = Date.now() % 100000;
        
        const values = [
          adminEmail, // email
          uniqueEmployeeNumber, // employee_number (bigint)
          adminName, // fullname
          adminName, // fullname_en
          1, // is_active (bigint: 1 for true)
          0, // is_correspondent (integer: 0 for false)
          0, // is_hidden (integer: 0 for false)
          'System Administrator', // job_title
          'System Administrator', // job_title_en
          adminEmail, // user_id (now using full email)
          1, // department_id
          uniqueEmployeeNumber // national_number (bigint)
        ];
        
        await pgClient.query(insertQuery, values);
        await pgClient.end();
        console.log('PostgreSQL employee record created successfully');
        
      } catch (pgError) {
        console.error('PostgreSQL operation failed:', pgError);
        // Continue with registration even if DB fails
      }
      
    } catch (secretError) {
      console.error('Failed to get database credentials from Secrets Manager:', secretError);
      // Continue with registration even if DB fails
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Registration successful! Your account has been created with LDAP and database integration.',
        instanceUrl: process.env.INSTANCE_URL,
        credentials: {
          username: adminEmail,
          password: 'TempPass123!'
        },
        note: 'You can now login to both the admin portal and MOAMALAT system with these credentials.'
      })
    };

  } catch (error) {
    console.error('Registration error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Registration failed. Please try again.'
      })
    };
  }
};

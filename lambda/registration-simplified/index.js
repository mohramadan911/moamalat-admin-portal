const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const sesClient = new SESClient({ region: 'us-east-1' });
const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });

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
    const { companyName, adminEmail, adminName, plan } = JSON.parse(event.body);
    
    console.log('Registration request:', { companyName, adminEmail, adminName, plan });

    // 1. Create Cognito user without email verification
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
      Password: 'TempPass123!', // Users will change this on first login
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

    // 3. Skip email sending for now - just save registration
    console.log('Registration completed - email sending skipped in development');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Registration successful! Your account has been created. Please contact support for instance access.',
        instanceUrl: process.env.INSTANCE_URL,
        note: 'Email notifications are currently disabled during testing phase.'
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

const { CognitoIdentityProviderClient, AdminCreateUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
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

    // 1. Create Cognito user with email verification
    const createUserParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: adminEmail,
      MessageAction: 'RESEND',
      UserAttributes: [
        { Name: 'email', Value: adminEmail },
        { Name: 'name', Value: adminName }
      ]
    };

    await cognitoClient.send(new AdminCreateUserCommand(createUserParams));
    console.log('Cognito user created successfully');

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

    // 3. Skip SES email for now - user will get Cognito verification email
    console.log('Registration completed - user will receive Cognito verification email');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Registration successful! Please check your email to verify your account, then contact support for instance access.',
        requiresVerification: true
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

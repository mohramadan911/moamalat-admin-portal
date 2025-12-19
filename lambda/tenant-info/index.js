const { CognitoIdentityProviderClient, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { Client } = require('pg');
const jwt = require('jsonwebtoken');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Extract JWT token from Authorization header
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Missing or invalid authorization header' })
      };
    }

    const token = authHeader.substring(7);

    // Get user info from Cognito
    const getUserParams = { AccessToken: token };
    const userResponse = await cognitoClient.send(new GetUserCommand(getUserParams));

    // Extract tenant_id from user attributes
    const tenantIdAttr = userResponse.UserAttributes.find(attr => attr.Name === 'custom:tenant_id');
    if (!tenantIdAttr) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Tenant ID not found in user attributes' })
      };
    }

    const tenantId = tenantIdAttr.Value;

    // Connect to database
    const dbClient = new Client({
      host: process.env.RDS_ENDPOINT,
      port: 5432,
      database: 'moamalat_saas',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    });

    await dbClient.connect();

    // Get tenant info from registry
    const tenantQuery = `
      SELECT tenant_id, company_name, plan, status, instance_url, 
             created_at, trial_expires_at
      FROM public.tenant_registry 
      WHERE tenant_id = $1
    `;
    const tenantResult = await dbClient.query(tenantQuery, [tenantId]);

    if (tenantResult.rows.length === 0) {
      await dbClient.end();
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Tenant not found' })
      };
    }

    const tenant = tenantResult.rows[0];

    // Get usage statistics
    const usageQueries = [
      `SELECT COUNT(*) as count FROM tenant_${tenantId}.documents`,
      `SELECT COUNT(*) as count FROM tenant_${tenantId}.correspondence`,
      `SELECT COUNT(*) as count FROM tenant_${tenantId}.users WHERE status = 'active'`
    ];

    const usageResults = await Promise.all(
      usageQueries.map(query => dbClient.query(query))
    );

    await dbClient.end();

    const response = {
      tenantId: tenant.tenant_id,
      companyName: tenant.company_name,
      status: tenant.status,
      plan: tenant.plan,
      createdAt: tenant.created_at,
      trialExpiresAt: tenant.trial_expires_at,
      instanceUrl: tenant.instance_url,
      usage: {
        documentsUploaded: parseInt(usageResults[0].rows[0].count),
        correspondenceCreated: parseInt(usageResults[1].rows[0].count),
        usersCount: parseInt(usageResults[2].rows[0].count)
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Tenant info error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Failed to get tenant info'
      })
    };
  }
};

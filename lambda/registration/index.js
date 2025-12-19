const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserAttributesCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const sesClient = new SESClient({ region: process.env.AWS_REGION });

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

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

    // Generate tenant ID
    const tenantId = slugify(companyName);
    const instanceUrl = `https://${tenantId}.moamalat.app`;
    const tempPassword = generateTempPassword();

    // Create Cognito user
    const createUserParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: adminEmail,
      TemporaryPassword: tempPassword,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        { Name: 'email', Value: adminEmail },
        { Name: 'name', Value: adminName },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'custom:tenant_id', Value: tenantId },
        { Name: 'custom:tenant_role', Value: 'ADMIN' },
        { Name: 'custom:tenant_status', Value: plan }
      ]
    };

    await cognitoClient.send(new AdminCreateUserCommand(createUserParams));

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

    // Insert into tenant registry
    const insertTenantQuery = `
      INSERT INTO public.tenant_registry (
        tenant_id, company_name, admin_email, plan, status, 
        instance_url, created_at, trial_expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const trialExpiresAt = plan === 'free-trial' 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
      : null;

    await dbClient.query(insertTenantQuery, [
      tenantId,
      companyName,
      adminEmail,
      plan,
      'active',
      instanceUrl,
      new Date(),
      trialExpiresAt
    ]);

    // Create tenant schema
    const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS tenant_${tenantId}`;
    await dbClient.query(createSchemaQuery);

    // Create basic tables in tenant schema
    const createTablesQueries = [
      `CREATE TABLE IF NOT EXISTS tenant_${tenantId}.documents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        size BIGINT,
        uploaded_by VARCHAR(255),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS tenant_${tenantId}.correspondence (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(500) NOT NULL,
        type VARCHAR(100),
        status VARCHAR(50) DEFAULT 'draft',
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS tenant_${tenantId}.users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'USER',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of createTablesQueries) {
      await dbClient.query(query);
    }

    // Insert admin user into tenant users table
    const insertAdminQuery = `
      INSERT INTO tenant_${tenantId}.users (email, name, role, status)
      VALUES ($1, $2, 'ADMIN', 'active')
    `;
    await dbClient.query(insertAdminQuery, [adminEmail, adminName]);

    await dbClient.end();

    // Send welcome email
    const emailParams = {
      Source: process.env.SES_FROM_EMAIL,
      Destination: { ToAddresses: [adminEmail] },
      Message: {
        Subject: { Data: 'Welcome to MOAMALAT - Your Instance is Ready!' },
        Body: {
          Html: {
            Data: `
              <h2>Welcome to MOAMALAT by DataServe!</h2>
              <p>Your MOAMALAT instance has been successfully created.</p>
              
              <h3>Instance Details</h3>
              <ul>
                <li><strong>Tenant ID:</strong> ${tenantId}</li>
                <li><strong>Instance URL:</strong> <a href="${instanceUrl}">${instanceUrl}</a></li>
                <li><strong>Plan:</strong> ${plan}</li>
                <li><strong>Created:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>

              <h3>Admin Credentials</h3>
              <ul>
                <li><strong>Username:</strong> ${adminEmail}</li>
                <li><strong>Temporary Password:</strong> ${tempPassword}</li>
              </ul>
              <p><em>Please change your password on first login.</em></p>

              <h3>Getting Started</h3>
              <ol>
                <li>Login to Admin Portal: <a href="https://admin.moamalat.app">https://admin.moamalat.app</a></li>
                <li>Access your MOAMALAT instance: <a href="${instanceUrl}">${instanceUrl}</a></li>
                <li>Add your team members</li>
                <li>Start managing your correspondence!</li>
              </ol>

              <p>Need help? Contact <a href="mailto:support@dataserve.com">support@dataserve.com</a></p>
              <hr>
              <p><small>© 2024 DataServe - MOAMALAT SaaS Platform</small></p>
            `
          }
        }
      }
    };

    await sesClient.send(new SendEmailCommand(emailParams));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        tenantId,
        instanceUrl,
        adminUsername: adminEmail,
        message: `Welcome email sent to ${adminEmail}`
      })
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Registration failed'
      })
    };
  }
};

const { Client } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

exports.handler = async (event) => {
  try {
    // Get database password from Secrets Manager
    const secretsClient = new SecretsManagerClient({ region: 'us-east-1' });
    const secretResponse = await secretsClient.send(new GetSecretValueCommand({
      SecretId: 'arn:aws:secretsmanager:us-east-1:339712855370:secret:moamalat-secrets-O34G1i'
    }));
    
    const secrets = JSON.parse(secretResponse.SecretString);
    
    // Connect to PostgreSQL
    const pgClient = new Client({
      host: 'moamalat-db.cfyic2o0y7cp.us-east-1.rds.amazonaws.com',
      port: 5432,
      database: 'moamalat',
      user: 'moamalat_user',
      password: secrets.db_password,
      ssl: { rejectUnauthorized: false }
    });
    
    await pgClient.connect();
    
    // Update user_id to match email format
    const updateQuery = `
      UPDATE employees 
      SET user_id = email 
      WHERE email = 'ssha.test@example.com'
      RETURNING *;
    `;
    
    const result = await pgClient.query(updateQuery);
    
    await pgClient.end();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User ID updated successfully',
        updated_user: result.rows[0]
      }, null, 2)
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      }, null, 2)
    };
  }
};

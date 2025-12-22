const { Client } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

async function checkPostgreSQLUser() {
  const secretsClient = new SecretsManagerClient({ region: 'us-east-1' });
  
  try {
    const secretResponse = await secretsClient.send(new GetSecretValueCommand({
      SecretId: 'moamalat-secrets'
    }));
    
    const secrets = JSON.parse(secretResponse.SecretString);
    
    const pgClient = new Client({
      host: 'moamalat-db.cfyic2o0y7cp.us-east-1.rds.amazonaws.com',
      port: 5432,
      database: 'moamalat',
      user: 'moamalat_user',
      password: secrets.db_password,
      ssl: { rejectUnauthorized: false }
    });
    
    await pgClient.connect();
    console.log('PostgreSQL connection successful');
    
    const result = await pgClient.query(
      'SELECT * FROM employees WHERE email = $1',
      ['fullstack.integration@example.com']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ User found in PostgreSQL:', result.rows[0]);
    } else {
      console.log('❌ User NOT found in PostgreSQL employees table');
    }
    
    await pgClient.end();
    
  } catch (error) {
    console.error('PostgreSQL error:', error);
  }
}

checkPostgreSQLUser();

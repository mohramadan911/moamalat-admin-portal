const { Client } = require('ldapts');
const { Client: PgClient } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

exports.handler = async (event) => {
  const email = event.email || 'ssha.test@example.com';
  const results = {};
  
  // Check PostgreSQL
  try {
    const secretsClient = new SecretsManagerClient({ region: 'us-east-1' });
    const secretResponse = await secretsClient.send(new GetSecretValueCommand({
      SecretId: 'arn:aws:secretsmanager:us-east-1:339712855370:secret:moamalat-secrets-O34G1i'
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
    
    await pgClient.connect();
    const result = await pgClient.query('SELECT * FROM employees WHERE email = $1', [email]);
    
    if (result.rows.length > 0) {
      results.postgresql = {
        found: true,
        user: result.rows[0]
      };
    } else {
      results.postgresql = { found: false };
    }
    
    await pgClient.end();
  } catch (error) {
    results.postgresql = { error: error.message };
  }
  
  // Check LDAP
  try {
    const ldapClient = new Client({ url: 'ldap://10.0.10.146:389' });
    await ldapClient.bind('cn=admin,dc=moamalat,dc=local', 'admin123');
    
    const searchResult = await ldapClient.search('ou=users,dc=moamalat,dc=local', {
      filter: `(mail=${email})`,
      scope: 'sub'
    });
    
    if (searchResult.searchEntries.length > 0) {
      results.ldap = {
        found: true,
        user: searchResult.searchEntries[0]
      };
    } else {
      results.ldap = { found: false };
    }
    
    await ldapClient.unbind();
  } catch (error) {
    results.ldap = { error: error.message };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(results, null, 2)
  };
};

const { Client: LdapClient } = require('ldapts');
const { Client: PgClient } = require('pg');

async function testUserExists() {
  const email = 'unique.test@example.com';
  
  // Test LDAP
  console.log('=== TESTING LDAP ===');
  const ldapClient = new LdapClient({ url: 'ldap://10.0.1.100:389' });
  
  try {
    await ldapClient.bind('cn=admin,dc=moamalat,dc=local', 'admin123');
    console.log('✅ LDAP admin bind successful');
    
    // Test user authentication
    const userDn = `uid=${email},ou=users,dc=moamalat,dc=local`;
    try {
      await ldapClient.bind(userDn, 'TempPass123!');
      console.log('✅ LDAP user authentication successful');
    } catch (authError) {
      console.log('❌ LDAP user authentication failed:', authError.message);
    }
    
    await ldapClient.unbind();
  } catch (error) {
    console.log('❌ LDAP connection failed:', error.message);
  }
  
  // Test PostgreSQL
  console.log('\n=== TESTING POSTGRESQL ===');
  const pgClient = new PgClient({
    host: 'moamalat-db.cfyic2o0y7cp.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'moamalat',
    user: 'moamalat_user',
    password: 'moamalat123',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful');
    
    const result = await pgClient.query(
      'SELECT * FROM employees WHERE email = $1',
      [email]
    );
    
    if (result.rows.length > 0) {
      console.log('✅ User found in PostgreSQL:', result.rows[0]);
    } else {
      console.log('❌ User not found in PostgreSQL');
    }
    
    await pgClient.end();
  } catch (error) {
    console.log('❌ PostgreSQL error:', error.message);
  }
}

testUserExists().catch(console.error);

const { Client } = require('pg');

async function checkSchemas() {
  const client = new Client({
    host: 'moamalat-db.cfyic2o0y7cp.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'moamalat',
    user: 'moamalat_user',
    password: 'SecurePassword123!'
  });

  try {
    await client.connect();
    
    const result = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1') 
      ORDER BY schema_name;
    `);
    
    console.log('Database Schemas:');
    result.rows.forEach(row => {
      console.log(`- ${row.schema_name}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkSchemas();

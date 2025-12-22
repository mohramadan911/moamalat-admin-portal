const { Client } = require('pg');

async function testPostgreSQL() {
  const pgClient = new Client({
    host: 'moamalat-db.cfyic2o0y7cp.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'moamalat',
    user: 'moamalat_user',
    password: 'SecurePassword123!'
  });

  try {
    await pgClient.connect();
    console.log('Connected to PostgreSQL');

    // Check if table exists and get its structure
    const tableInfo = await pgClient.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'employees' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Table structure:', tableInfo.rows);

    // Try to drop and recreate table
    await pgClient.query('DROP TABLE IF EXISTS employees');
    console.log('Dropped existing table');

    const createTableQuery = `
      CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        employee_number VARCHAR(50) UNIQUE,
        fullname VARCHAR(255),
        fullname_en VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        is_correspondent BOOLEAN DEFAULT false,
        is_hidden BOOLEAN DEFAULT false,
        job_title VARCHAR(255),
        job_title_en VARCHAR(255),
        user_id VARCHAR(255),
        department_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pgClient.query(createTableQuery);
    console.log('Created new table');

    // Test insert
    const insertQuery = `
      INSERT INTO employees (
        email, employee_number, fullname, fullname_en, 
        is_active, is_correspondent, is_hidden, 
        job_title, job_title_en, user_id, department_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    
    const values = [
      'test@example.com',
      '1234',
      'Test User',
      'Test User',
      true,
      false,
      false,
      'Admin',
      'Admin',
      'test',
      1
    ];
    
    await pgClient.query(insertQuery, values);
    console.log('Insert successful');

    await pgClient.end();
  } catch (error) {
    console.error('Error:', error);
    await pgClient.end();
  }
}

testPostgreSQL();

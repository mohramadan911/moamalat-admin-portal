const { Client } = require('pg');

async function testPostgresUser() {
    const client = new Client({
        host: 'moamalat-db.cfyic2o0y7cp.us-east-1.rds.amazonaws.com',
        port: 5432,
        database: 'moamalat_db',
        user: 'moamalat_user',
        password: 'moamalat123',
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ PostgreSQL connection successful');

        // Check if user exists in employees table
        const result = await client.query(
            'SELECT * FROM employees WHERE email = $1',
            ['test.integration@example.com']
        );

        if (result.rows.length > 0) {
            console.log('✅ User found in PostgreSQL:');
            console.log(JSON.stringify(result.rows[0], null, 2));
        } else {
            console.log('❌ User NOT found in PostgreSQL employees table');
        }

    } catch (error) {
        console.error('❌ PostgreSQL test failed:', error.message);
    } finally {
        await client.end();
    }
}

testPostgresUser();

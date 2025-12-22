const { Client } = require('ldapts');

async function testLDAPUser() {
    const client = new Client({
        url: 'ldap://10.0.10.146:389'
    });

    try {
        // Bind as admin
        await client.bind('cn=admin,dc=moamalat,dc=local', 'admin123');
        console.log('✅ LDAP admin bind successful');

        // Search for the test user
        const searchResult = await client.search('dc=moamalat,dc=local', {
            scope: 'sub',
            filter: '(mail=test.integration@example.com)'
        });

        if (searchResult.searchEntries.length > 0) {
            console.log('✅ User found in LDAP:');
            console.log(JSON.stringify(searchResult.searchEntries[0], null, 2));
        } else {
            console.log('❌ User NOT found in LDAP');
        }

        // Test user authentication
        try {
            const userDN = `cn=test.integration@example.com,ou=users,dc=moamalat,dc=local`;
            await client.bind(userDN, 'TempPass123!');
            console.log('✅ User authentication successful');
        } catch (authError) {
            console.log('❌ User authentication failed:', authError.message);
        }

    } catch (error) {
        console.error('❌ LDAP test failed:', error.message);
    } finally {
        await client.unbind();
    }
}

testLDAPUser();

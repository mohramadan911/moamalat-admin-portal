const { Client } = require('ldapts');

async function checkLDAPUser() {
  const client = new Client({
    url: 'ldap://ec2-54-91-188-221.compute-1.amazonaws.com:389'
  });

  try {
    await client.bind('cn=admin,dc=moamalat,dc=local', 'admin123');
    console.log('LDAP bind successful');
    
    const { searchEntries } = await client.search('dc=moamalat,dc=local', {
      scope: 'sub',
      filter: '(mail=fullstack.integration@example.com)'
    });
    
    if (searchEntries.length > 0) {
      console.log('✅ User found in LDAP:', searchEntries[0]);
    } else {
      console.log('❌ User NOT found in LDAP');
    }
    
  } catch (error) {
    console.error('LDAP error:', error);
  } finally {
    await client.unbind();
  }
}

checkLDAPUser();

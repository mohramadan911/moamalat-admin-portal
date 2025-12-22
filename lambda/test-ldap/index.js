const { Client } = require('ldapts');

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
    console.log('Querying LDAP schema and structure');
    
    const client = new Client({
      url: 'ldap://10.0.10.146:389',
      timeout: 10000,
      connectTimeout: 10000
    });

    try {
      // Bind with admin credentials
      await client.bind('cn=admin,dc=moamalat,dc=local', 'admin123');
      console.log('LDAP admin bind successful');
      
      // Query schema
      const schemaResult = await client.search('cn=schema', {
        scope: 'base',
        attributes: ['objectClasses', 'attributeTypes']
      });
      
      // Query organizational structure
      const orgResult = await client.search('dc=moamalat,dc=local', {
        scope: 'sub',
        filter: '(objectClass=*)',
        attributes: ['dn', 'objectClass', 'cn', 'ou']
      });
      
      // Query existing users
      const usersResult = await client.search('dc=moamalat,dc=local', {
        scope: 'sub',
        filter: '(objectClass=inetOrgPerson)',
        attributes: ['dn', 'uid', 'cn', 'mail', 'objectClass']
      });
      
      await client.unbind();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'LDAP schema and structure query successful',
          server: '10.0.10.146:389',
          schema: schemaResult.searchEntries,
          organization: orgResult.searchEntries,
          existingUsers: usersResult.searchEntries
        })
      };
      
    } catch (bindError) {
      console.error('LDAP operation error:', bindError);
      await client.unbind();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          error: bindError.message,
          server: '10.0.10.146:389',
          stage: 'ldap_operations'
        })
      };
    }

  } catch (error) {
    console.error('LDAP connection error:', error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'LDAP connection failed',
        server: '10.0.10.146:389',
        stage: 'connection'
      })
    };
  }
};

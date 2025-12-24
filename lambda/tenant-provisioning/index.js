const { ECSClient, DescribeTaskDefinitionCommand, RegisterTaskDefinitionCommand, CreateServiceCommand, DescribeServicesCommand } = require('@aws-sdk/client-ecs');
const { ElasticLoadBalancingV2Client, CreateTargetGroupCommand, CreateRuleCommand, DescribeListenersCommand } = require('@aws-sdk/client-elastic-load-balancing-v2');
const { Route53Client, ChangeResourceRecordSetsCommand } = require('@aws-sdk/client-route-53');
const { ACMClient, RequestCertificateCommand, DescribeCertificateCommand } = require('@aws-sdk/client-acm');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { RDSClient, ExecuteStatementCommand } = require('@aws-sdk/client-rds');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { CloudWatchLogsClient, CreateLogGroupCommand } = require('@aws-sdk/client-cloudwatch-logs');
const { Client: PgClient } = require('pg');

const ecsClient = new ECSClient({ region: process.env.AWS_REGION || 'us-east-1' });
const elbClient = new ElasticLoadBalancingV2Client({ region: process.env.AWS_REGION || 'us-east-1' });
const route53Client = new Route53Client({ region: process.env.AWS_REGION || 'us-east-1' });
const acmClient = new ACMClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }));
const secretsClient = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' });
const logsClient = new CloudWatchLogsClient({ region: process.env.AWS_REGION || 'us-east-1' });

exports.handler = async (event) => {
  console.log('Tenant Provisioning Event:', JSON.stringify(event, null, 2));
  
  const { action, tenant_id, subdomain } = event;
  
  try {
    switch (action) {
      case 'validate':
        return await validateInput(event.input);
      case 'create_schema':
        return await createDatabaseSchema(tenant_id, subdomain);
      case 'create_backend_task_definition':
        return await createBackendTaskDefinition(tenant_id, subdomain);
      case 'create_frontend_task_definition':
        return await createFrontendTaskDefinition(tenant_id, subdomain);
      case 'create_backend_target_group':
        return await createBackendTargetGroup(tenant_id, subdomain);
      case 'create_frontend_target_group':
        return await createFrontendTargetGroup(tenant_id, subdomain);
      case 'create_backend_alb_rule':
        return await createBackendALBRule(tenant_id, subdomain);
      case 'create_frontend_alb_rule':
        return await createFrontendALBRule(tenant_id, subdomain);
      case 'deploy_backend':
        return await deployBackendService(tenant_id, subdomain);
      case 'deploy_frontend':
        return await deployFrontendService(tenant_id, subdomain);
      case 'list_schemas':
        return await listDatabaseSchemas();
    case 'create_dns':
        return await createDNSRecord(tenant_id, subdomain);
      case 'create_certificate':
        return await createSSLCertificate(tenant_id, subdomain);
      case 'finalize':
        return await finalizeProvisioning(tenant_id, subdomain);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error(`Error in ${action}:`, error);
    // Skip DynamoDB update for list_schemas and validate actions
    if (action !== 'list_schemas' && action !== 'validate') {
      await updateTenantStatus(tenant_id, 'failed', { error: error.message });
    }
    throw error;
  }
};

async function validateInput(input) {
  // Handle both input formats for backward compatibility
  const subdomain = input.subdomain || input.tenantId;
  const company_name = input.company_name || input.companyName;
  const admin_email = input.admin_email || input.adminEmail;
  const plan = input.plan;
  
  if (!subdomain || !company_name || !admin_email || !plan) {
    throw new Error('Missing required fields');
  }
  
  // Validate subdomain format
  if (!/^[a-z0-9-]{3,20}$/.test(subdomain)) {
    throw new Error('Invalid subdomain format');
  }
  
  // Check subdomain availability
  const existingTenant = await getTenantBySubdomain(subdomain);
  if (existingTenant) {
    throw new Error('Subdomain already exists');
  }
  
  const tenant_id = generateTenantId();
  
  // Create initial tenant record in DynamoDB
  await dynamoClient.send(new UpdateCommand({
    TableName: process.env.TENANTS_TABLE,
    Key: { tenant_id },
    UpdateExpression: 'SET #status = :status, subdomain = :subdomain, company_name = :company_name, admin_email = :admin_email, #plan = :plan, created_at = :created_at, updated_at = :updated_at',
    ExpressionAttributeNames: { 
      '#status': 'status',
      '#plan': 'plan'
    },
    ExpressionAttributeValues: {
      ':status': 'validated',
      ':subdomain': subdomain,
      ':company_name': company_name,
      ':admin_email': admin_email,
      ':plan': plan,
      ':created_at': new Date().toISOString(),
      ':updated_at': new Date().toISOString()
    }
  }));
  
  return {
    tenant_id,
    subdomain,
    plan,
    admin_email,
    company_name,
    status: 'validated'
  };
}

async function createDatabaseSchema(tenant_id, subdomain) {
  // Get database credentials
  const secretResponse = await secretsClient.send(new GetSecretValueCommand({
    SecretId: 'arn:aws:secretsmanager:us-east-1:339712855370:secret:moamalat-secrets-O34G1i'
  }));
  
  const secrets = JSON.parse(secretResponse.SecretString);
  
  // Connect to PostgreSQL (connect to postgres database to create new database)
  const pgClient = new PgClient({
    host: 'moamalat-db.cfyic2o0y7cp.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'moamalat_user',
    password: secrets.db_password,
    ssl: { rejectUnauthorized: false }
  });
  
  await pgClient.connect();
  
  // Create database for the tenant
  await pgClient.query(`CREATE DATABASE "${subdomain}"`);
  
  await pgClient.end();
  
  await updateTenantStatus(tenant_id, 'database_ready');
  
  return { tenant_id, subdomain, status: 'database_ready' };
}

async function createBackendTaskDefinition(tenant_id, subdomain) {
  // Create CloudWatch log group first
  const logGroupName = `/ecs/moamalat-${subdomain}-backend`;
  try {
    await logsClient.send(new CreateLogGroupCommand({
      logGroupName: logGroupName
    }));
    console.log(`Created log group: ${logGroupName}`);
  } catch (error) {
    if (error.name !== 'ResourceAlreadyExistsException') {
      console.error(`Failed to create log group: ${error.message}`);
      throw error;
    }
    console.log(`Log group already exists: ${logGroupName}`);
  }

  // Get template task definition
  const templateResponse = await ecsClient.send(new DescribeTaskDefinitionCommand({
    taskDefinition: 'moamalat-api:4'
  }));
  
  const template = templateResponse.taskDefinition;
  
  // Modify for new tenant
  const newTaskDef = {
    family: `moamalat-${subdomain}-backend`,
    networkMode: template.networkMode,
    requiresCompatibilities: template.requiresCompatibilities,
    cpu: template.cpu,
    memory: template.memory,
    executionRoleArn: template.executionRoleArn,
    taskRoleArn: template.taskRoleArn,
    containerDefinitions: template.containerDefinitions.map(container => ({
      ...container,
      name: `${subdomain}-moamalat-api`,
      image: '339712855370.dkr.ecr.us-east-1.amazonaws.com/moamalat-api:paid',
      portMappings: [
        {
          containerPort: 8081,
          hostPort: 8081,
          protocol: 'tcp'
        }
      ],
      environment: [
        ...container.environment.filter(env => env.name !== 'SERVER_PORT' && env.name !== 'SPRING_PROFILES_ACTIVE'),
        { name: 'DB_NAME', value: subdomain },
        { name: 'SPRING_PROFILES_ACTIVE', value: 'paid' }
      ],
      logConfiguration: {
        ...container.logConfiguration,
        options: {
          ...container.logConfiguration.options,
          'awslogs-group': `/ecs/moamalat-${subdomain}-backend`
        }
      }
    }))
  };
  
  const response = await ecsClient.send(new RegisterTaskDefinitionCommand(newTaskDef));
  
  await updateTenantStatus(tenant_id, 'backend_task_definition_created', {
    backend_task_definition_arn: response.taskDefinition.taskDefinitionArn
  });
  
  return { tenant_id, subdomain, backend_task_definition_arn: response.taskDefinition.taskDefinitionArn };
}

async function createFrontendTaskDefinition(tenant_id, subdomain) {
  // Create CloudWatch log group first
  const logGroupName = `/ecs/moamalat-${subdomain}-frontend`;
  try {
    await logsClient.send(new CreateLogGroupCommand({
      logGroupName: logGroupName
    }));
    console.log(`Created log group: ${logGroupName}`);
  } catch (error) {
    if (error.name !== 'ResourceAlreadyExistsException') {
      console.error(`Failed to create log group: ${error.message}`);
      throw error;
    }
    console.log(`Log group already exists: ${logGroupName}`);
  }

  // Get template task definition
  const templateResponse = await ecsClient.send(new DescribeTaskDefinitionCommand({
    taskDefinition: 'moamalat-frontend:2'
  }));
  
  const template = templateResponse.taskDefinition;
  const api_url = `https://${subdomain}.moamalat-pro.com/moamalat-api/`;
  
  // Modify for new tenant
  const newTaskDef = {
    family: `moamalat-${subdomain}-frontend`,
    networkMode: template.networkMode,
    requiresCompatibilities: template.requiresCompatibilities,
    cpu: template.cpu,
    memory: template.memory,
    executionRoleArn: template.executionRoleArn,
    taskRoleArn: template.taskRoleArn,
    containerDefinitions: template.containerDefinitions.map(container => ({
      ...container,
      environment: [
        ...container.environment.filter(env => env.name !== 'API_URL'),
        { name: 'API_URL', value: api_url }
      ],
      logConfiguration: {
        ...container.logConfiguration,
        options: {
          ...container.logConfiguration.options,
          'awslogs-group': `/ecs/moamalat-${subdomain}-frontend`
        }
      }
    }))
  };
  
  const response = await ecsClient.send(new RegisterTaskDefinitionCommand(newTaskDef));
  
  await updateTenantStatus(tenant_id, 'frontend_task_definition_created', {
    frontend_task_definition_arn: response.taskDefinition.taskDefinitionArn
  });
  
  return { tenant_id, subdomain, frontend_task_definition_arn: response.taskDefinition.taskDefinitionArn };
}

async function createBackendTargetGroup(tenant_id, subdomain) {
  const response = await elbClient.send(new CreateTargetGroupCommand({
    Name: `${subdomain}-be-tg`,
    Protocol: 'HTTP',
    Port: 8081,
    VpcId: process.env.VPC_ID,
    TargetType: 'ip',
    HealthCheckProtocol: 'HTTP',
    HealthCheckPath: '/',
    HealthCheckIntervalSeconds: 30,
    HealthCheckTimeoutSeconds: 10,
    HealthyThresholdCount: 2,
    UnhealthyThresholdCount: 10,
    Matcher: { HttpCode: '200,404' }
  }));
  
  await updateTenantStatus(tenant_id, 'backend_target_group_created', {
    backend_target_group_arn: response.TargetGroups[0].TargetGroupArn
  });
  
  return { tenant_id, subdomain, backend_target_group_arn: response.TargetGroups[0].TargetGroupArn };
}

async function createFrontendTargetGroup(tenant_id, subdomain) {
  const response = await elbClient.send(new CreateTargetGroupCommand({
    Name: `${subdomain}-fe-tg`,
    Protocol: 'HTTP',
    Port: 80,
    VpcId: process.env.VPC_ID,
    TargetType: 'ip',
    HealthCheckProtocol: 'HTTP',
    HealthCheckPath: '/',
    HealthCheckIntervalSeconds: 30,
    HealthCheckTimeoutSeconds: 5,
    HealthyThresholdCount: 2,
    UnhealthyThresholdCount: 2,
    Matcher: {
      HttpCode: '200'
    }
  }));
  
  await updateTenantStatus(tenant_id, 'frontend_target_group_created', {
    frontend_target_group_arn: response.TargetGroups[0].TargetGroupArn
  });
  
  return { tenant_id, subdomain, frontend_target_group_arn: response.TargetGroups[0].TargetGroupArn };
}

async function createBackendALBRule(tenant_id, subdomain) {
  // Get ALB listeners
  const listenersResponse = await elbClient.send(new DescribeListenersCommand({
    LoadBalancerArn: process.env.ALB_ARN
  }));
  
  const httpsListener = listenersResponse.Listeners.find(l => l.Port === 443);
  const tenant = await getTenant(tenant_id);
  
  const response = await elbClient.send(new CreateRuleCommand({
    ListenerArn: httpsListener.ListenerArn,
    Priority: Math.floor(Math.random() * 49000) + 1000, // Random priority (1000-49999)
    Conditions: [
      {
        Field: 'host-header',
        Values: [`${subdomain}.${process.env.DOMAIN_NAME}`]
      },
      {
        Field: 'path-pattern',
        Values: ['/moamalat-api/*']
      }
    ],
    Actions: [
      {
        Type: 'forward',
        TargetGroupArn: tenant.backend_target_group_arn
      }
    ]
  }));
  
  await updateTenantStatus(tenant_id, 'backend_alb_configured', {
    backend_rule_arn: response.Rules[0].RuleArn
  });
  
  return { tenant_id, subdomain, backend_rule_arn: response.Rules[0].RuleArn };
}

async function createFrontendALBRule(tenant_id, subdomain) {
  // Get ALB listeners
  const listenersResponse = await elbClient.send(new DescribeListenersCommand({
    LoadBalancerArn: process.env.ALB_ARN
  }));
  
  const httpsListener = listenersResponse.Listeners.find(l => l.Port === 443);
  const tenant = await getTenant(tenant_id);
  
  const response = await elbClient.send(new CreateRuleCommand({
    ListenerArn: httpsListener.ListenerArn,
    Priority: Math.floor(Math.random() * 48000) + 2000, // Higher priority for frontend (2000-49999)
    Conditions: [
      {
        Field: 'host-header',
        Values: [`${subdomain}.${process.env.DOMAIN_NAME}`]
      }
      // No path-pattern = matches all paths (default)
    ],
    Actions: [
      {
        Type: 'forward',
        TargetGroupArn: tenant.frontend_target_group_arn
      }
    ]
  }));
  
  await updateTenantStatus(tenant_id, 'frontend_alb_configured', {
    frontend_rule_arn: response.Rules[0].RuleArn
  });
  
  return { tenant_id, subdomain, frontend_rule_arn: response.Rules[0].RuleArn };
}

async function createDNSRecord(tenant_id, subdomain) {
  const response = await route53Client.send(new ChangeResourceRecordSetsCommand({
    HostedZoneId: process.env.ROUTE53_ZONE_ID,
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: `${subdomain}.${process.env.DOMAIN_NAME}`,
            Type: 'A',
            AliasTarget: {
              DNSName: 'moamalat-alb-1983543041.us-east-1.elb.amazonaws.com',
              EvaluateTargetHealth: false,
              HostedZoneId: 'Z35SXDOTRQ7X7K'
            }
          }
        }
      ]
    }
  }));
  
  await updateTenantStatus(tenant_id, 'dns_configured');
  
  return { tenant_id, subdomain, change_id: response.ChangeInfo.Id };
}

async function createSSLCertificate(tenant_id, subdomain) {
  const domainName = `${subdomain}.${process.env.DOMAIN_NAME}`;
  
  const response = await acmClient.send(new RequestCertificateCommand({
    DomainName: domainName,
    ValidationMethod: 'DNS',
    SubjectAlternativeNames: [`*.${subdomain}.${process.env.DOMAIN_NAME}`]
  }));
  
  await updateTenantStatus(tenant_id, 'certificate_requested', {
    certificate_arn: response.CertificateArn
  });
  
  return { 
    tenant_id, 
    subdomain, 
    certificate_arn: response.CertificateArn,
    domain_name: domainName
  };
}

async function deployBackendService(tenant_id, subdomain) {
  const tenant = await getTenant(tenant_id);
  const serviceName = `moamalat-${subdomain}-backend`;
  
  try {
    // Check if service already exists
    const existingService = await ecsClient.send(new DescribeServicesCommand({
      cluster: process.env.ECS_CLUSTER_NAME,
      services: [serviceName]
    }));
    
    if (existingService.services && existingService.services.length > 0 && existingService.services[0].status === 'ACTIVE') {
      // Service exists and is active, return existing service ARN
      const serviceArn = existingService.services[0].serviceArn;
      await updateTenantStatus(tenant_id, 'backend_deploying', {
        backend_service_arn: serviceArn
      });
      return { tenant_id, subdomain, backend_service_arn: serviceArn };
    }
  } catch (error) {
    // Service doesn't exist, continue to create it
  }
  
  const response = await ecsClient.send(new CreateServiceCommand({
    serviceName,
    cluster: process.env.ECS_CLUSTER_NAME,
    taskDefinition: tenant.backend_task_definition_arn,
    desiredCount: 1,
    launchType: 'FARGATE',
    healthCheckGracePeriodSeconds: 300,
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: process.env.PRIVATE_SUBNET_IDS.split(','),
        securityGroups: ['sg-0e27b16dd1e3b9819'], // Use correct ECS security group
        assignPublicIp: 'DISABLED'
      }
    },
    loadBalancers: [
      {
        targetGroupArn: tenant.backend_target_group_arn,
        containerName: `${subdomain}-moamalat-api`,
        containerPort: 8081
      }
    ]
  }));
  
  await updateTenantStatus(tenant_id, 'backend_deploying', {
    backend_service_arn: response.service.serviceArn
  });
  
  // Wait for service to become stable (up to 10 minutes)
  const maxWaitTime = 10 * 60 * 1000; // 10 minutes
  const checkInterval = 30 * 1000; // 30 seconds
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const serviceStatus = await ecsClient.send(new DescribeServicesCommand({
      cluster: process.env.ECS_CLUSTER_NAME,
      services: [serviceName]
    }));
    
    if (serviceStatus.services && serviceStatus.services.length > 0) {
      const service = serviceStatus.services[0];
      if (service.runningCount > 0 && service.deployments.some(d => d.status === 'PRIMARY' && d.runningCount > 0)) {
        console.log(`Service ${serviceName} is running successfully`);
        break;
      }
    }
    
    console.log(`Waiting for service ${serviceName} to become healthy...`);
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }
  
  return { tenant_id, subdomain, backend_service_arn: response.service.serviceArn };
}

async function deployFrontendService(tenant_id, subdomain) {
  const tenant = await getTenant(tenant_id);
  
  const response = await ecsClient.send(new CreateServiceCommand({
    serviceName: `moamalat-${subdomain}-frontend`,
    cluster: process.env.ECS_CLUSTER_NAME,
    taskDefinition: tenant.frontend_task_definition_arn,
    desiredCount: 1,
    launchType: 'FARGATE',
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: process.env.PRIVATE_SUBNET_IDS.split(','),
        securityGroups: ['sg-0e27b16dd1e3b9819'], // Use correct ECS security group
        assignPublicIp: 'DISABLED'
      }
    },
    loadBalancers: [
      {
        targetGroupArn: tenant.frontend_target_group_arn,
        containerName: 'moamalat-frontend', // Assuming this is the container name
        containerPort: 80
      }
    ]
  }));
  
  await updateTenantStatus(tenant_id, 'frontend_deploying', {
    frontend_service_arn: response.service.serviceArn
  });
  
  return { tenant_id, subdomain, frontend_service_arn: response.service.serviceArn };
}

async function finalizeProvisioning(tenant_id, subdomain) {
  await updateTenantStatus(tenant_id, 'active', {
    url: `https://${subdomain}.${process.env.DOMAIN_NAME}`,
    api_url: `https://${subdomain}.${process.env.DOMAIN_NAME}/moamalat-api`,
    activated_at: new Date().toISOString()
  });
  
  return {
    tenant_id,
    subdomain,
    status: 'active',
    url: `https://${subdomain}.${process.env.DOMAIN_NAME}`
  };
}

// Helper functions
function generateTenantId() {
  return require('crypto').randomUUID();
}

async function getTenant(tenant_id) {
  const response = await dynamoClient.send(new GetCommand({
    TableName: process.env.TENANTS_TABLE,
    Key: { tenant_id }
  }));
  
  if (!response.Item) {
    throw new Error('Tenant not found');
  }
  
  return {
    tenant_id: response.Item.tenant_id,
    subdomain: response.Item.subdomain,
    backend_target_group_arn: response.Item.backend_target_group_arn,
    frontend_target_group_arn: response.Item.frontend_target_group_arn,
    backend_task_definition_arn: response.Item.backend_task_definition_arn,
    frontend_task_definition_arn: response.Item.frontend_task_definition_arn,
    backend_service_arn: response.Item.backend_service_arn,
    frontend_service_arn: response.Item.frontend_service_arn
  };
}

async function getTenantBySubdomain(subdomain) {
  // Implementation for checking subdomain availability
  return null; // Simplified for now
}

async function updateTenantStatus(tenant_id, status, additionalData = {}) {
  let updateExpression = 'SET #status = :status, updated_at = :updated_at';
  const expressionAttributeNames = { '#status': 'status' };
  const expressionAttributeValues = {
    ':status': status,
    ':updated_at': new Date().toISOString()
  };
  
  // Add additional data to update
  Object.entries(additionalData).forEach(([key, value], index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    updateExpression += `, ${attrName} = ${attrValue}`;
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = String(value);
  });
  
  await dynamoClient.send(new UpdateCommand({
    TableName: process.env.TENANTS_TABLE,
    Key: { tenant_id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  }));
}

async function listDatabaseSchemas() {
  const client = new PgClient({
    host: process.env.DB_HOST || 'moamalat-db.cfyic2o0y7cp.us-east-1.rds.amazonaws.com',
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
    
    const schemas = result.rows.map(row => row.schema_name);
    
    await client.end();
    
    return {
      status: 'success',
      schemas: schemas,
      count: schemas.length
    };
    
  } catch (error) {
    console.error('Database schema check error:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
}

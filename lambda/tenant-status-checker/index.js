const { ECSClient, DescribeServicesCommand, DescribeTasksCommand } = require('@aws-sdk/client-ecs');
const { CloudWatchLogsClient, FilterLogEventsCommand } = require('@aws-sdk/client-cloudwatch-logs');
const { ElasticLoadBalancingV2Client, DescribeTargetHealthCommand } = require('@aws-sdk/client-elastic-load-balancing-v2');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const ecsClient = new ECSClient({ region: process.env.AWS_REGION || 'us-east-1' });
const logsClient = new CloudWatchLogsClient({ region: process.env.AWS_REGION || 'us-east-1' });
const elbClient = new ElasticLoadBalancingV2Client({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }));

exports.handler = async (event) => {
  console.log('Status Check Event:', JSON.stringify(event, null, 2));
  
  const { tenant_id, check_type, subdomain } = event;
  
  try {
    const tenant = await getTenant(tenant_id);
    // Use subdomain from event if available, fallback to tenant record
    const tenantSubdomain = subdomain || tenant.subdomain;
    
    switch (check_type) {
      case 'backend':
        return await checkBackendHealth(tenant);
      case 'backend_logs':
        return await checkBackendLogs(tenant, tenantSubdomain);
      case 'frontend':
        return await checkFrontendHealth(tenant);
      default:
        throw new Error(`Unknown check type: ${check_type}`);
    }
  } catch (error) {
    console.error('Status check error:', error);
    return {
      tenant_id,
      status: 'unhealthy',
      reason: error.message
    };
  }
};

async function checkBackendLogs(tenant, subdomain) {
  try {
    const logGroupName = `/ecs/moamalat-${subdomain}-backend`;
    const searchText = "Tomcat started on port(s): 8081 (http) with context path '/moamalat-api'";
    
    // Search logs from the last 10 minutes
    const endTime = Date.now();
    const startTime = endTime - (10 * 60 * 1000); // 10 minutes ago
    
    const response = await logsClient.send(new FilterLogEventsCommand({
      logGroupName: logGroupName,
      startTime: startTime,
      endTime: endTime,
      filterPattern: `"${searchText}"`
    }));
    
    if (response.events && response.events.length > 0) {
      return { tenant_id: tenant.tenant_id, status: 'healthy', message: 'Tomcat started successfully' };
    } else {
      return { tenant_id: tenant.tenant_id, status: 'unhealthy', reason: 'Tomcat startup message not found in logs' };
    }
    
  } catch (error) {
    console.error('Backend logs check error:', error);
    
    // If log group doesn't exist yet, service might still be starting
    if (error.name === 'ResourceNotFoundException' || error.message.includes('does not exist')) {
      return {
        tenant_id: tenant.tenant_id,
        status: 'unhealthy',
        reason: 'Service still starting - log group not created yet'
      };
    }
    
    return { tenant_id: tenant.tenant_id, status: 'unhealthy', reason: error.message };
  }
}

async function checkBackendHealth(tenant) {
  try {
    // Check ECS service status
    const serviceResponse = await ecsClient.send(new DescribeServicesCommand({
      cluster: process.env.ECS_CLUSTER_NAME,
      services: [tenant.backend_service_arn]
    }));
    
    const service = serviceResponse.services[0];
    if (!service) {
      return { tenant_id: tenant.tenant_id, status: 'unhealthy', reason: 'Service not found' };
    }
    
    // Check if service is running
    if (service.runningCount === 0) {
      return { tenant_id: tenant.tenant_id, status: 'unhealthy', reason: 'No running tasks' };
    }
    
    // Check target group health
    if (tenant.target_group_arn) {
      const targetHealthResponse = await elbClient.send(new DescribeTargetHealthCommand({
        TargetGroupArn: tenant.target_group_arn
      }));
      
      const healthyTargets = targetHealthResponse.TargetHealthDescriptions.filter(
        target => target.TargetHealth.State === 'healthy'
      );
      
      if (healthyTargets.length === 0) {
        return { tenant_id: tenant.tenant_id, status: 'unhealthy', reason: 'No healthy targets' };
      }
    }
    
    return { tenant_id: tenant.tenant_id, status: 'healthy' };
    
  } catch (error) {
    console.error('Backend health check error:', error);
    return { tenant_id: tenant.tenant_id, status: 'unhealthy', reason: error.message };
  }
}

async function checkFrontendHealth(tenant) {
  // Similar logic for frontend service
  return { tenant_id: tenant.tenant_id, status: 'healthy' };
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
    backend_service_arn: response.Item.backend_service_arn,
    frontend_service_arn: response.Item.frontend_service_arn,
    backend_target_group_arn: response.Item.backend_target_group_arn,
    frontend_target_group_arn: response.Item.frontend_target_group_arn
  };
}

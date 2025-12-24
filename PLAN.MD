lets check first the lambda functionality in the backend and report your findings to make : 

When a user clicks "Create" with a subdomain name, the Lambda function will provision a complete isolated tenant environment including database schema, ECS services, load balancer routing, and DNS.

## 🏗️ Infrastructure Components (Existing)
- **ECS Cluster:** `moamalat-cluster` (ACTIVE)
- **ALB:** `moamalat-alb` (internet-facing)
- **Route53:** `moamalat-pro.com` hosted zone
- **Template Service:** `test-moamalat-api:2` (for cloning)
- **Frontend Template:** `moamalat-frontend:2`

## 📊 DynamoDB Tables
### `tenants` Table Schema:
```json
{
  "tenant_id": "UUID (Primary Key)",
  "subdomain": "String (GSI)",
  "plan": "free-trial | professional",
  "admin_email": "String",
  "status": "provisioning | database_ready | backend_deploying | frontend_deploying | active | failed",
  "created_at": "ISO Timestamp",
  "activated_at": "ISO Timestamp",
  "provisioning_id": "UUID",
  "cluster_name": "moamalat-cluster",
  "alb_arn": "ALB ARN",
  "url": "https://{subdomain}.moamalat-pro.com",
  "api_url": "https://{subdomain}.moamalat-pro.com/moamalat-api",
  "backend_service_arn": "ECS Service ARN",
  "frontend_service_arn": "ECS Service ARN",
  "target_group_arn": "ALB Target Group ARN",
  "task_definition_arn": "ECS Task Definition ARN"
}
```

📋 Provisioning Steps
Phase 1: Validation & Record Creation
Step 1: Input Validation
├── Validate subdomain format:
│   ├── Lowercase only
│   ├── Alphanumeric + hyphens allowed
│   ├── Length: 3-20 characters
│   ├── No special characters
│   └── Must start/end with alphanumeric
├── Check subdomain availability in DynamoDB
│   └── If exists → Return error: "Subdomain already exists"
├── Validate plan type (free-trial / professional)
└── Generate unique tenant_id (UUID)
Step 2: Record Tenant in DynamoDB
├── Create record in tenants table:
│   ├── tenant_id: <generated UUID>
│   ├── subdomain: <user input>
│   ├── plan: <selected plan>
│   ├── admin_email: <from Cognito>
│   ├── status: "provisioning"
│   ├── created_at: <timestamp>
│   ├── provisioning_id: <for status tracking>
│   ├── cluster_name: "moamalat-cluster"
│   └── alb_arn: "arn:aws:elasticloadbalancing:us-east-1:339712855370:loadbalancer/app/moamalat-alb/25303afaeb8924d6"
└── Return provisioning_id to frontend for polling

Phase 2: Database Setup
Step 3: Create Database Schema
├── Get DB credentials from Secrets Manager
│   └── Secret: moamalat-secrets
├── Connect to RDS PostgreSQL instance
│   └── Instance: moamalat-db
├── Execute SQL:
│   └── CREATE SCHEMA IF NOT EXISTS "{subdomain}"
├── Schema is created EMPTY
│   └── Hibernate will auto-create tables on ECS startup
└── Update DynamoDB:
    └── status: "database_ready"

Phase 3: ECS Task Definition
Step 4: Create Task Definition (Copy & Modify)
├── Describe existing task definition:
│   └── Source: test-moamalat-api:2 (template)
├── Create NEW task definition:
│   └── Name: moamalat-{subdomain}
├── Modify environment variables:
│   ├── DB_NAME = {subdomain}
│   ├── spring.jpa.hibernate.ddl-auto = create
│   ├── LDAP_HOST = <EC2 OpenLDAP IP>
│   └── S3_BUCKET = moamalat-saas-documents-339712855370
├── Keep unchanged:
│   ├── CPU/Memory allocation
│   ├── IAM task role
│   ├── Log configuration
│   └── Container image
└── Register new task definition

Phase 4: Load Balancer Configuration
Step 5: Create Target Group
├── Create target group:
│   ├── Name: moamalat-{subdomain}-tg
│   ├── Target type: IP
│   ├── Protocol: HTTP
│   ├── Port: 8080
│   ├── VPC: Same as existing services
└── Update DynamoDB:
    └── status: "target_group_created"
Step 6: Create ALB Listener Rule
├── Get existing HTTPS listener (port 443)
├── Create new rule:
│   ├── Condition: Host header = {subdomain}.moamalat-pro.com
│   ├── Action: Forward to moamalat-{subdomain}-tg
│   └── Priority: Auto-assign (next available)
└── Update DynamoDB:
    └── status: "alb_configured"

Phase 5: DNS Configuration
Step 7: Create Route53 DNS Record
├── Hosted zone: moamalat-pro.com
├── Create/Update record:
│   ├── Type: A (Alias)
│   ├── Name: {subdomain}.moamalat-pro.com
│   ├── Target: ALB DNS name
│   └── TTL: 300 seconds
└── Update DynamoDB:
    └── status: "dns_configured"

Phase 6: ECS Service Deployment
Step 8: Create & Launch ECS Service (Backend)
├── Create ECS service:
│   ├── Service name: moamalat-{subdomain}-api
│   ├── Cluster: moamalat-cluster
│   ├── Task definition: moamalat-{subdomain}:1
│   ├── Launch type: FARGATE
│   ├── Desired count: 1
│   ├── Network configuration:
│   │   ├── Subnets: Private subnets
│   │   ├── Security group: Existing ECS SG
│   │   └── Assign public IP: false
│   └── Load balancer:
│       ├── Target group: moamalat-{subdomain}-tg
│       ├── Container name: moamalat-api
│       └── Container port: 8080
├── Wait for service to stabilize
└── Update DynamoDB:
    └── status: "backend_deploying"
Step 9: Monitor Backend Startup
├── Poll ECS task logs (CloudWatch)
├── Scan for success message:
│   └── "Tomcat started on port(s): 8081 (http) with context path '/moamalat-api'"
├── Retry configuration:
│   ├── Max attempts: 20
│   ├── Interval: 30 seconds
│   └── Timeout: 10 minutes
├── On success:
│   └── Proceed to frontend deployment
└── On failure:
    ├── Update DynamoDB: status: "backend_failed"
    └── Return error to user
Step 10: Create & Launch ECS Service (Frontend)
├── Describe existing frontend task definition:
│   └── Source: moamalat-frontend:2
├── Create NEW task definition:
│   ├── Name: moamalat-{subdomain}-frontend
│   └── Modify environment variables:
│       └── API_URL = https://{subdomain}.moamalat-pro.com/moamalat-api
├── Create ECS service:
│   ├── Service name: moamalat-{subdomain}-frontend
│   ├── Cluster: moamalat-cluster
│   ├── Same network/security as backend
│   └── Same IAM roles
└── Update DynamoDB:
    └── status: "frontend_deploying"

Phase 7: Health Check & Finalization
Step 11: Health Check & Validation
├── Wait for ECS tasks: RUNNING
│   └── Max wait: 5 minutes
├── Check target group health: HEALTHY
│   ├── Retry: Up to 10 times
│   └── Interval: 30 seconds
├── Verify endpoint accessibility:
│   └── GET https://{subdomain}.moamalat-pro.com/moamalat-api/swagger-ui/index.html
├── On success:
│   └── Update DynamoDB: status: "ready"
└── On failure:
    ├── Update DynamoDB: status: "failed"
    ├── Store error details
    └── Trigger cleanup (optional)
Step 12: Return Result & Notify User
├── Update DynamoDB final record:
│   ├── status: "active"
│   ├── url: https://{subdomain}.moamalat-pro.com
│   ├── api_url: https://{subdomain}.moamalat-pro.com/moamalat-api
│   ├── activated_at: <timestamp>
│   └── admin_credentials_sent: true
├── update welcome email :
│   ├── Instance URL
│   ├── Admin credentials
│   └── Getting started guide
└── Return to frontend:
    {
      "success": true,
      "tenantId": "{subdomain}",
      "url": "https://{subdomain}.moamalat-pro.com",
      "adminUsername": "admin",
      "password": "admin123"
      "message": "Your MOAMALAT instance is ready!"
    }
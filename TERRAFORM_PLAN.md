# Tenant Provisioning Infrastructure - Terraform Plan

## Architecture: Step Functions Workflow (Option B)

```
User Registration → Registration Lambda → Step Function → Provisioning Lambda
                                      ↓
                                   DynamoDB Status Updates
```

## 📁 Directory Structure
```
terraform/
├── main.tf                    # Main configuration
├── variables.tf               # Input variables
├── outputs.tf                 # Output values
├── lambda.tf                  # Lambda functions
├── stepfunctions.tf           # Step Functions workflow
├── iam.tf                     # IAM roles and policies
├── dynamodb.tf                # DynamoDB tables
└── modules/
    └── tenant-provisioning/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

## 🏗️ Infrastructure Components

### 1. Lambda Functions
- **`tenant-registration`** - User registration (existing, enhanced)
- **`tenant-provisioning`** - ECS/ALB/DNS provisioning (new)
- **`tenant-status-checker`** - Health monitoring (new)

### 2. Step Functions
- **`tenant-provisioning-workflow`** - Orchestrates provisioning steps

### 3. IAM Roles
- **`tenant-registration-role`** - Cognito, DynamoDB, Step Functions
- **`tenant-provisioning-role`** - ECS, ALB, Route53, RDS
- **`step-functions-role`** - Lambda invocation, DynamoDB

### 4. DynamoDB Tables
- **`tenants`** - Tenant tracking (created)
- **`tenant-registrations`** - User registrations (existing)

## 🔄 Step Functions Workflow

```json
{
  "Comment": "Tenant Provisioning Workflow",
  "StartAt": "ValidateInput",
  "States": {
    "ValidateInput": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-provisioning",
      "Parameters": {
        "action": "validate",
        "input.$": "$"
      },
      "Next": "CreateDatabaseSchema"
    },
    "CreateDatabaseSchema": {
      "Type": "Task", 
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-provisioning",
      "Parameters": {
        "action": "create_schema",
        "tenant_id.$": "$.tenant_id",
        "subdomain.$": "$.subdomain"
      },
      "Next": "CreateTaskDefinition"
    },
    "CreateTaskDefinition": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-provisioning", 
      "Parameters": {
        "action": "create_task_definition",
        "tenant_id.$": "$.tenant_id",
        "subdomain.$": "$.subdomain"
      },
      "Next": "CreateTargetGroup"
    },
    "CreateTargetGroup": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-provisioning",
      "Parameters": {
        "action": "create_target_group", 
        "tenant_id.$": "$.tenant_id",
        "subdomain.$": "$.subdomain"
      },
      "Next": "CreateALBRule"
    },
    "CreateALBRule": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-provisioning",
      "Parameters": {
        "action": "create_alb_rule",
        "tenant_id.$": "$.tenant_id", 
        "subdomain.$": "$.subdomain"
      },
      "Next": "CreateDNSRecord"
    },
    "CreateDNSRecord": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-provisioning",
      "Parameters": {
        "action": "create_dns",
        "tenant_id.$": "$.tenant_id",
        "subdomain.$": "$.subdomain"
      },
      "Next": "DeployBackendService"
    },
    "DeployBackendService": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-provisioning",
      "Parameters": {
        "action": "deploy_backend",
        "tenant_id.$": "$.tenant_id",
        "subdomain.$": "$.subdomain"
      },
      "Next": "WaitForBackend"
    },
    "WaitForBackend": {
      "Type": "Wait",
      "Seconds": 60,
      "Next": "CheckBackendHealth"
    },
    "CheckBackendHealth": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-status-checker",
      "Parameters": {
        "tenant_id.$": "$.tenant_id",
        "check_type": "backend"
      },
      "Next": "BackendHealthChoice"
    },
    "BackendHealthChoice": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.status",
          "StringEquals": "healthy",
          "Next": "DeployFrontendService"
        },
        {
          "Variable": "$.status", 
          "StringEquals": "unhealthy",
          "Next": "BackendFailed"
        }
      ],
      "Default": "WaitForBackend"
    },
    "DeployFrontendService": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-provisioning",
      "Parameters": {
        "action": "deploy_frontend",
        "tenant_id.$": "$.tenant_id",
        "subdomain.$": "$.subdomain"
      },
      "Next": "WaitForFrontend"
    },
    "WaitForFrontend": {
      "Type": "Wait", 
      "Seconds": 60,
      "Next": "CheckFrontendHealth"
    },
    "CheckFrontendHealth": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-status-checker",
      "Parameters": {
        "tenant_id.$": "$.tenant_id",
        "check_type": "frontend"
      },
      "Next": "FrontendHealthChoice"
    },
    "FrontendHealthChoice": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.status",
          "StringEquals": "healthy", 
          "Next": "ProvisioningComplete"
        },
        {
          "Variable": "$.status",
          "StringEquals": "unhealthy",
          "Next": "FrontendFailed"
        }
      ],
      "Default": "WaitForFrontend"
    },
    "ProvisioningComplete": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:tenant-provisioning",
      "Parameters": {
        "action": "finalize",
        "tenant_id.$": "$.tenant_id",
        "subdomain.$": "$.subdomain"
      },
      "End": true
    },
    "BackendFailed": {
      "Type": "Fail",
      "Cause": "Backend service failed to start"
    },
    "FrontendFailed": {
      "Type": "Fail", 
      "Cause": "Frontend service failed to start"
    }
  }
}
```

## 📋 Implementation Timeline

### Phase 1: Terraform Infrastructure (Day 1)
1. **Lambda Functions Setup**
   - Create IAM roles with required permissions
   - Package and deploy Lambda functions
   - Configure VPC and security groups

2. **Step Functions Creation**
   - Define state machine
   - Configure error handling
   - Set up CloudWatch logging

### Phase 2: Lambda Function Development (Day 2-3)
3. **Registration Lambda Enhancement**
   - Add Step Functions trigger
   - Update DynamoDB schema usage
   - Maintain existing LDAP/Cognito functionality

4. **Provisioning Lambda Development**
   - Implement action-based handler
   - Add ECS service management
   - Add ALB/Route53 configuration

### Phase 3: Status Checker & Testing (Day 4)
5. **Status Checker Lambda**
   - ECS service health monitoring
   - Target group health validation
   - Endpoint accessibility testing

6. **Integration Testing**
   - End-to-end workflow testing
   - Error handling validation
   - Performance optimization

## 🔧 Terraform Variables

```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "vpc_id" {
  description = "VPC ID for resources"
  type        = string
  default     = "vpc-074fbfda710f9a931"
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
  default     = ["subnet-03b9c8ef4c78431c5", "subnet-01859110d63358d8f"]
}

variable "ecs_cluster_name" {
  description = "ECS cluster name"
  type        = string
  default     = "moamalat-cluster"
}

variable "alb_arn" {
  description = "Application Load Balancer ARN"
  type        = string
  default     = "arn:aws:elasticloadbalancing:us-east-1:339712855370:loadbalancer/app/moamalat-alb/25303afaeb8924d6"
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
  default     = "Z01557883SJQKW0ELRWJQ"
}

variable "domain_name" {
  description = "Domain name for tenants"
  type        = string
  default     = "moamalat-pro.com"
}
```

## 📊 Expected Outputs

```hcl
output "registration_lambda_arn" {
  description = "Registration Lambda function ARN"
  value       = aws_lambda_function.tenant_registration.arn
}

output "provisioning_lambda_arn" {
  description = "Provisioning Lambda function ARN" 
  value       = aws_lambda_function.tenant_provisioning.arn
}

output "step_function_arn" {
  description = "Step Functions state machine ARN"
  value       = aws_sfn_state_machine.tenant_provisioning.arn
}

output "tenants_table_name" {
  description = "Tenants DynamoDB table name"
  value       = aws_dynamodb_table.tenants.name
}
```

## 🚀 Deployment Commands

```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var-file="production.tfvars"

# Apply infrastructure
terraform apply -var-file="production.tfvars"

# Package Lambda functions
./scripts/package-lambdas.sh

# Update Lambda code
terraform apply -target=aws_lambda_function.tenant_registration
terraform apply -target=aws_lambda_function.tenant_provisioning
```

## 🔍 Monitoring & Logging

- **CloudWatch Logs** - Lambda function logs
- **Step Functions Console** - Workflow execution tracking
- **DynamoDB Streams** - Tenant status changes
- **CloudWatch Alarms** - Error rate monitoring
- **X-Ray Tracing** - End-to-end request tracing

---

**Next Steps:**
1. Create Terraform configuration files
2. Implement Lambda functions
3. Deploy and test infrastructure
4. Integrate with existing registration system

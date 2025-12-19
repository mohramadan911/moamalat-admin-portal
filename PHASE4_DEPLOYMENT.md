# Phase 4 - Registration API & Backend Deployment Guide

## Overview

Phase 4 implements the backend infrastructure for tenant registration and management, including:
- Lambda functions for tenant registration and info retrieval
- API Gateway for REST endpoints
- Database schema creation
- SES email integration
- Frontend API integration

## Prerequisites

Before deploying, ensure you have:

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** installed (v1.0+)
3. **Node.js** installed (v18+)
4. **Database credentials** for RDS PostgreSQL
5. **SES verified email** for sending welcome emails

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    REGISTRATION FLOW                         │
└─────────────────────────────────────────────────────────────┘

Frontend (React)
    │
    ├─▶ POST /api/registration/tenant
    │       │
    │       ▼
    │   Lambda: tenant-registration
    │       │
    │       ├─▶ Create Cognito User
    │       ├─▶ Create DB Schema (tenant_*)
    │       ├─▶ Insert into tenant_registry
    │       └─▶ Send Welcome Email (SES)
    │
    └─▶ GET /api/tenant/info
            │
            ▼
        Lambda: tenant-info
            │
            ├─▶ Get User from Cognito
            ├─▶ Query tenant_registry
            └─▶ Query usage stats
```

## Deployment Steps

### Step 1: Configure Database Credentials

Create a `terraform.tfvars` file in the `terraform/` directory:

```hcl
# terraform/terraform.tfvars
db_user     = "your_db_username"
db_password = "your_db_password"

# Optional: Override defaults
github_repository = "https://github.com/your-org/moamalat-admin-portal"
ses_from_email   = "noreply@yourdomain.com"
```

**⚠️ Important:** Add `terraform.tfvars` to `.gitignore` to avoid committing credentials!

### Step 2: Prepare Database

Ensure your PostgreSQL database has the required schema:

```sql
-- Create tenant registry table
CREATE TABLE IF NOT EXISTS public.tenant_registry (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    instance_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trial_expires_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_tracking (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value BIGINT DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenant_registry(tenant_id)
);

-- Create indexes
CREATE INDEX idx_tenant_registry_tenant_id ON public.tenant_registry(tenant_id);
CREATE INDEX idx_tenant_registry_admin_email ON public.tenant_registry(admin_email);
CREATE INDEX idx_usage_tracking_tenant_id ON public.usage_tracking(tenant_id);
```

### Step 3: Package Lambda Functions

Run the deployment script to package Lambda functions:

```bash
./scripts/deploy-lambdas.sh
```

This will:
- Install dependencies for each Lambda
- Create ZIP files
- Move them to the `terraform/` directory

### Step 4: Initialize Terraform

```bash
cd terraform
terraform init
```

This will:
- Initialize the S3 backend
- Download required providers
- Prepare for deployment

### Step 5: Review Terraform Plan

```bash
terraform plan
```

Review the resources that will be created:
- 2 Lambda functions
- API Gateway with REST API
- IAM roles and policies
- Amplify app configuration

### Step 6: Deploy Infrastructure

```bash
terraform apply
```

Type `yes` when prompted to confirm deployment.

### Step 7: Update Frontend Environment

After deployment, update your `.env` file with the API Gateway URL:

```bash
# Get the API Gateway URL from Terraform output
terraform output api_gateway_url

# Update .env
VITE_API_ENDPOINT=<api_gateway_url_from_output>
```

### Step 8: Test the Integration

1. **Start the frontend:**
   ```bash
   cd ..
   npm run dev
   ```

2. **Test registration flow:**
   - Navigate to `/register`
   - Fill in the registration form
   - Submit and verify email
   - Login and check dashboard

3. **Verify backend:**
   - Check CloudWatch logs for Lambda execution
   - Verify database entries in `tenant_registry`
   - Confirm welcome email was sent

## API Endpoints

### POST /api/registration/tenant

**Request:**
```json
{
  "companyName": "Acme Corporation",
  "adminEmail": "admin@acme.com",
  "adminName": "John Doe",
  "plan": "free-trial"
}
```

**Response:**
```json
{
  "success": true,
  "tenantId": "acme-corporation",
  "instanceUrl": "https://acme-corporation.moamalat.app",
  "adminUsername": "admin@acme.com",
  "message": "Welcome email sent to admin@acme.com"
}
```

### GET /api/tenant/info

**Headers:**
```
Authorization: Bearer <cognito_access_token>
```

**Response:**
```json
{
  "tenantId": "acme-corporation",
  "companyName": "Acme Corporation",
  "status": "active",
  "plan": "free-trial",
  "createdAt": "2024-12-19T00:00:00Z",
  "trialExpiresAt": "2025-01-18T00:00:00Z",
  "instanceUrl": "https://acme-corporation.moamalat.app",
  "usage": {
    "documentsUploaded": 0,
    "correspondenceCreated": 0,
    "usersCount": 1
  }
}
```

## Monitoring & Troubleshooting

### CloudWatch Logs

View Lambda logs:
```bash
# Registration Lambda
aws logs tail /aws/lambda/moamalat-tenant-registration --follow

# Tenant Info Lambda
aws logs tail /aws/lambda/moamalat-tenant-info --follow
```

### Common Issues

**1. Database Connection Failed**
- Verify RDS security group allows Lambda access
- Check database credentials in Terraform variables
- Ensure RDS is in the same VPC or accessible

**2. SES Email Not Sent**
- Verify SES email is verified in AWS Console
- Check SES is out of sandbox mode for production
- Review Lambda IAM permissions for SES

**3. Cognito User Creation Failed**
- Verify Cognito User Pool ID is correct
- Check custom attributes are configured
- Review Lambda IAM permissions for Cognito

**4. API Gateway 403 Error**
- Verify CORS is configured correctly
- Check Lambda permissions for API Gateway
- Review API Gateway deployment stage

## Cleanup

To destroy all resources:

```bash
cd terraform
terraform destroy
```

**⚠️ Warning:** This will delete all Lambda functions, API Gateway, and related resources!

## Security Considerations

1. **Database Credentials:** Store in AWS Secrets Manager for production
2. **API Authentication:** Consider adding API Gateway authorizers
3. **Rate Limiting:** Implement API Gateway throttling
4. **Input Validation:** Lambda functions validate all inputs
5. **SQL Injection:** Using parameterized queries
6. **CORS:** Configured for specific origins in production

## Next Steps

After successful deployment:
1. Test end-to-end registration flow
2. Verify email delivery
3. Check database entries
4. Monitor CloudWatch metrics
5. Proceed to Phase 5 (Deployment & CI/CD)

## Support

For issues or questions:
- Check CloudWatch logs
- Review Terraform state
- Contact: support@dataserve.com

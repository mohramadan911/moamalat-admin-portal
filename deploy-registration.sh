#!/bin/bash

echo "🚀 Deploying MOAMALAT Registration System..."

# Step 1: Package the simplified Lambda function
echo "📦 Packaging Lambda function..."
cd lambda/registration-simplified
npm install --production
zip -r ../../terraform/registration.zip . -x "*.git*" "node_modules/.cache/*"
cd ../../

# Step 2: Deploy infrastructure with Terraform
echo "🏗️ Deploying infrastructure..."
cd terraform
terraform init
terraform plan -target=aws_ses_email_identity.sender_email -target=aws_dynamodb_table.tenant_registrations -target=aws_iam_role_policy.lambda_registration_policy
terraform apply -target=aws_ses_email_identity.sender_email -target=aws_dynamodb_table.tenant_registrations -target=aws_iam_role_policy.lambda_registration_policy -auto-approve

# Step 3: Update Lambda function
echo "⚡ Updating Lambda function..."
aws lambda update-function-code \
  --function-name moamalat-tenant-registration \
  --zip-file fileb://registration.zip \
  --region us-east-1

# Step 4: Update Lambda environment variables (fixed format)
echo "🔧 Updating Lambda environment..."
aws lambda update-function-configuration \
  --function-name moamalat-tenant-registration \
  --environment Variables="{COGNITO_USER_POOL_ID=us-east-1_oM7CNtGJs,COGNITO_CLIENT_ID=7t4ruho469cb5mc6391casn18n,SES_FROM_EMAIL=mohamed.issa@dataserve.com.sa,DYNAMODB_TABLE=tenant-registrations,INSTANCE_URL=https://moamalat-pro.com,TRIAL_DAYS=14}" \
  --region us-east-1

# Step 5: Verify SES email
echo "📧 Verifying SES email..."
aws ses verify-email-identity --email-address mohamed.issa@dataserve.com.sa --region us-east-1

echo "⏳ Waiting for Lambda to be ready..."
sleep 10

# Step 6: Test the system
echo "🧪 Testing registration endpoint..."
curl -X POST https://3l09d2vwik.execute-api.us-east-1.amazonaws.com/prod/api/registration/tenant \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "adminEmail": "test@example.com",
    "adminName": "Test User",
    "plan": "free-trial"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Check your email: mohamed.issa@dataserve.com.sa for SES verification"
echo "2. Test registration from frontend"
echo "3. Check DynamoDB table: tenant-registrations"
echo "4. Monitor CloudWatch logs: /aws/lambda/moamalat-tenant-registration"

#!/bin/bash

# Package Lambda functions for tenant provisioning
echo "📦 Packaging Lambda functions..."

# Package tenant provisioning Lambda
cd lambda/tenant-provisioning
npm install --production
zip -r ../../terraform/tenant-provisioning.zip . -x "*.zip"
cd ../..

# Package tenant status checker Lambda
cd lambda/tenant-status-checker
npm install --production
zip -r ../../terraform/tenant-status-checker.zip . -x "*.zip"
cd ../..

echo "✅ Lambda functions packaged successfully!"

# Deploy with Terraform
echo "🚀 Deploying infrastructure with Terraform..."
cd terraform

# Initialize if needed
if [ ! -d ".terraform" ]; then
    terraform init
fi

# Plan deployment
terraform plan -var-file="terraform.tfvars"

# Ask for confirmation
read -p "Do you want to apply these changes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    terraform apply -var-file="terraform.tfvars"
    echo "✅ Infrastructure deployed successfully!"
else
    echo "❌ Deployment cancelled"
fi

cd ..

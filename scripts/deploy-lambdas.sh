#!/bin/bash

# Deploy Lambda functions for MOAMALAT Admin Portal

set -e

echo "🚀 Deploying Lambda functions..."

# Create deployment directory
mkdir -p dist

# Package registration Lambda
echo "📦 Packaging registration Lambda..."
cd lambda/registration
npm install --production
zip -r ../../dist/lambda-registration.zip . -x "*.git*" "node_modules/.cache/*"
cd ../..

# Package tenant-info Lambda
echo "📦 Packaging tenant-info Lambda..."
cd lambda/tenant-info
npm install --production
zip -r ../../dist/lambda-tenant-info.zip . -x "*.git*" "node_modules/.cache/*"
cd ../..

# Move zip files to terraform directory
mv dist/lambda-registration.zip terraform/
mv dist/lambda-tenant-info.zip terraform/

echo "✅ Lambda functions packaged successfully!"
echo "📁 Files created:"
echo "   - terraform/lambda-registration.zip"
echo "   - terraform/lambda-tenant-info.zip"
echo ""
echo "🔧 Next steps:"
echo "   1. cd terraform"
echo "   2. terraform init"
echo "   3. terraform plan"
echo "   4. terraform apply"

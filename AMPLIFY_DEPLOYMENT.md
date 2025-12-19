# AWS Amplify Deployment Guide

## Overview
This guide explains how to deploy the MOAMALAT Admin Portal to AWS Amplify with GitHub integration.

## Infrastructure Status ✅

### Completed Infrastructure
- **Lambda Functions**: ✅ Deployed with VPC configuration for RDS access
- **API Gateway**: ✅ Deployed with CORS configuration
- **Security Groups**: ✅ Lambda security group created for VPC access
- **Amplify App**: ✅ Created (App ID: d2ob6jx0c2iik9)
- **Environment Variables**: ✅ Configured in Amplify

### VPC Configuration ✅
- **VPC ID**: vpc-08900b7b25b33e062
- **Subnets**: subnet-0678db2951afbaf06, subnet-098b9c3dade975c5d, subnet-04c07a5bdd421c591
- **Security Group**: sg-0241565456e7913c0 (allows RDS access on port 5432)
- **Lambda Functions**: Now have VPC access to connect to RDS database

## Deployment Options

### Option 1: Manual GitHub Connection (Recommended)

1. **Access AWS Amplify Console**
   ```
   https://console.aws.amazon.com/amplify/home?region=eu-central-1#/d2ob6jx0c2iik9
   ```

2. **Connect GitHub Repository**
   - Click "Connect branch" or "Connect repository"
   - Select GitHub as the source
   - Authorize AWS Amplify to access your GitHub account
   - Select repository: `mohramadan911/moamalat-admin-portal`
   - Select branch: `main`
   - Confirm the build settings (already configured)

3. **Deploy**
   - Click "Save and deploy"
   - Monitor the build process in the Amplify console

### Option 2: Manual Deployment via Amplify CLI

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Build the Application**
   ```bash
   cd /Users/mohamedramadan/Documents/dataserverepos/moamalat-admin-portal
   npm run build
   ```

3. **Deploy to Amplify**
   ```bash
   # Create a deployment package
   cd dist
   zip -r ../deployment.zip .
   
   # Upload via AWS CLI
   aws amplify create-deployment \
     --app-id d2ob6jx0c2iik9 \
     --branch-name main \
     --region eu-central-1
   ```

### Option 3: GitHub Actions (Future Enhancement)

Create `.github/workflows/deploy.yml` for automated deployments:

```yaml
name: Deploy to Amplify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1
      - run: |
          cd dist
          zip -r ../deployment.zip .
          aws amplify create-deployment --app-id d2ob6jx0c2iik9 --branch-name main
```

## Environment Variables (Already Configured)

The following environment variables are already set in Amplify:

```
VITE_COGNITO_USER_POOL_ID=eu-central-1_Ej8Ej8Ej8
VITE_COGNITO_CLIENT_ID=1234567890abcdef1234567890
VITE_COGNITO_REGION=eu-central-1
VITE_API_ENDPOINT=https://n4q32pnif1.execute-api.eu-central-1.amazonaws.com/prod
VITE_MOAMALAT_APP_URL=https://app.moamalat.com
```

## Build Configuration (Already Set)

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Access URLs

- **Amplify Console**: https://console.aws.amazon.com/amplify/home?region=eu-central-1#/d2ob6jx0c2iik9
- **Default Domain**: https://d2ob6jx0c2iik9.amplifyapp.com (after deployment)
- **API Gateway**: https://n4q32pnif1.execute-api.eu-central-1.amazonaws.com/prod

## Troubleshooting

### GitHub Token Issues
If you encounter GitHub token issues:
1. Generate a new Personal Access Token with `repo` and `admin:repo_hook` permissions
2. Update the token in AWS Amplify console manually

### Build Failures
- Check build logs in Amplify console
- Verify all dependencies are in package.json
- Ensure environment variables are set correctly

### VPC Connectivity Issues
- Lambda functions are now configured with VPC access
- Security group allows outbound traffic to RDS (port 5432)
- Database credentials are retrieved from AWS Secrets Manager

## Next Steps

1. **Connect GitHub Repository** using Option 1 above
2. **Test the Deployment** by accessing the Amplify URL
3. **Set up Custom Domain** (optional) in Amplify console
4. **Configure CI/CD** for automatic deployments on code changes

## Support

For issues with deployment:
1. Check AWS Amplify console logs
2. Verify API Gateway endpoints are accessible
3. Test Lambda functions individually
4. Check VPC and security group configurations

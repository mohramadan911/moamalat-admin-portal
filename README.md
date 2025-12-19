# 🚀 MOAMALAT SaaS Admin Portal

> A complete admin portal for the MOAMALAT SaaS platform - Built with React, TypeScript, AWS Amplify, and Terraform

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-Amplify-orange.svg)](https://aws.amazon.com/amplify/)
[![Terraform](https://img.shields.io/badge/Terraform-1.0+-purple.svg)](https://www.terraform.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Overview

MOAMALAT Admin Portal is a production-ready SaaS administration platform that enables customers to:
- Register and create their own tenant instances
- Manage their MOAMALAT subscription
- Access their dedicated business application
- Monitor usage and statistics

**Built by:** DataServe  
**Product:** MOAMALAT SaaS Platform

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX** - Professional design with Tailwind CSS
- **Responsive Design** - Works seamlessly on all devices
- **Authentication** - Complete auth flow with AWS Cognito
- **Protected Routes** - Secure dashboard access
- **Real-time Updates** - Dynamic tenant information

### 🔐 Authentication
- User registration with company details
- Email verification via Cognito
- Secure login with session management
- Password reset functionality
- Protected routes with automatic redirects

### 📊 Dashboard
- Tenant information display
- Usage statistics and metrics
- Quick actions panel
- "Open MOAMALAT" business app access
- Professional admin interface

### ⚙️ Backend
- **Lambda Functions** - Serverless tenant provisioning
- **API Gateway** - RESTful APIs with CORS
- **Database** - PostgreSQL RDS with schema per tenant
- **Email** - AWS SES for notifications
- **Security** - Secrets Manager for credentials

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MOAMALAT ADMIN PORTAL                     │
└─────────────────────────────────────────────────────────────┘

Frontend (React + TypeScript)
    │
    ├─▶ AWS Cognito (Authentication)
    │
    ├─▶ API Gateway
    │       │
    │       ├─▶ Lambda: Tenant Registration
    │       │       ├─▶ Create Cognito User
    │       │       ├─▶ Create DB Schema
    │       │       ├─▶ Insert Tenant Registry
    │       │       └─▶ Send Welcome Email (SES)
    │       │
    │       └─▶ Lambda: Tenant Info
    │               ├─▶ Get User from Cognito
    │               ├─▶ Query Tenant Registry
    │               └─▶ Return Usage Stats
    │
    └─▶ PostgreSQL RDS (Multi-tenant)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured
- Terraform 1.0+
- AWS Account with appropriate permissions

### Installation

```bash
# Clone the repository
git clone https://github.com/mohramadan911/moamalat-admin-portal.git
cd moamalat-admin-portal

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your AWS credentials

# Start development server
npm run dev
```

### Environment Variables

```bash
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_COGNITO_REGION=eu-central-1
VITE_API_ENDPOINT=your-api-gateway-url
VITE_MOAMALAT_APP_URL=https://app.moamalat.app
```

## 🏗️ Infrastructure Deployment

### Deploy Backend with Terraform

```bash
# Package Lambda functions
./scripts/deploy-lambdas.sh

# Initialize Terraform
cd terraform
terraform init

# Review changes
terraform plan

# Deploy infrastructure
terraform apply
```

### Terraform Resources Created

- 2 Lambda Functions (tenant-registration, tenant-info)
- API Gateway with REST API
- IAM Roles and Policies
- API Gateway Stage (prod)
- CORS Configuration

## 📁 Project Structure

```
moamalat-admin-portal/
├── src/
│   ├── components/          # React components
│   │   ├── layout/         # Header, Footer, DashboardLayout
│   │   ├── forms/          # RegisterForm, LoginForm
│   │   └── dashboard/      # TenantCard, UsageStats, QuickActions
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts (Auth)
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   └── aws-exports.ts      # AWS configuration
├── lambda/                 # Lambda function code
│   ├── registration/       # Tenant registration
│   └── tenant-info/        # Tenant information
├── terraform/              # Infrastructure as Code
│   ├── main.tf            # Main configuration
│   ├── variables.tf       # Variables
│   ├── outputs.tf         # Outputs
│   └── backend.tf         # S3 backend
├── scripts/               # Deployment scripts
└── docs/                  # Documentation
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment
./scripts/deploy-lambdas.sh    # Package Lambda functions
cd terraform && terraform apply # Deploy infrastructure
```

## 🌐 API Endpoints

### Registration API
```http
POST /api/registration/tenant
Content-Type: application/json

{
  "companyName": "Acme Corporation",
  "adminEmail": "admin@acme.com",
  "adminName": "John Doe",
  "plan": "free-trial"
}
```

### Tenant Info API
```http
GET /api/tenant/info
Authorization: Bearer {cognito-token}
```

## 🔐 Security

- **Authentication**: AWS Cognito with MFA support
- **Authorization**: JWT tokens with custom claims
- **Database**: Secrets Manager for credentials
- **API**: CORS configured, rate limiting ready
- **IAM**: Least privilege access policies
- **Encryption**: Data encrypted at rest and in transit

## 📊 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **UI Framework** | Tailwind CSS, shadcn/ui |
| **Authentication** | AWS Amplify, Cognito |
| **Backend** | AWS Lambda, Node.js 18 |
| **API** | API Gateway REST API |
| **Database** | PostgreSQL RDS |
| **Email** | AWS SES |
| **Infrastructure** | Terraform, AWS |
| **State Management** | React Context |
| **Forms** | React Hook Form, Zod |

## 📖 Documentation

- [Implementation Plan](IMPLEMENTATION_PLAN.md) - Complete development roadmap
- [Phase 4 Deployment](PHASE4_DEPLOYMENT.md) - Backend deployment guide
- [Phase 5 Completion](PHASE5_COMPLETION_REPORT.md) - Final deployment report

## 🚦 Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| **Frontend** | ✅ Running | `http://localhost:5173` |
| **API Gateway** | ✅ Live | `https://n4q32pnif1.execute-api.eu-central-1.amazonaws.com/prod` |
| **Lambda Functions** | ✅ Deployed | 2 functions active |
| **Database** | ✅ Ready | PostgreSQL RDS |
| **Authentication** | ✅ Active | AWS Cognito |

## 🎯 Roadmap

- [x] Phase 1: Setup & Landing Page
- [x] Phase 2: Authentication System
- [x] Phase 3: Admin Dashboard
- [x] Phase 4: Backend APIs
- [x] Phase 5: Infrastructure Deployment
- [ ] Phase 6: VPC Configuration for Lambda
- [ ] Phase 7: Amplify Hosting Setup
- [ ] Phase 8: Custom Domain Configuration
- [ ] Phase 9: Enhanced Monitoring
- [ ] Phase 10: CI/CD Pipeline

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Built by:** DataServe  
**Product:** MOAMALAT SaaS Platform  
**Developer:** Mohamed Ramadan

## 📧 Support

For support, email support@dataserve.com or open an issue in this repository.

## 🙏 Acknowledgments

- AWS Amplify for authentication framework
- Tailwind CSS for styling system
- shadcn/ui for component library
- Vite for blazing fast development

---

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by DataServe

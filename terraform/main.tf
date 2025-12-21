provider "aws" {
  region = var.aws_region
}

# Get database credentials from Secrets Manager
data "aws_secretsmanager_secret" "database" {
  name = "moamalat-secrets"
}

data "aws_secretsmanager_secret_version" "database" {
  secret_id = data.aws_secretsmanager_secret.database.id
}

locals {
  db_credentials = jsondecode(data.aws_secretsmanager_secret_version.database.secret_string)
}

# Get VPC and subnet information
data "aws_vpc" "moamalat_vpc" {
  id = "vpc-074fbfda710f9a931"
}

data "aws_subnets" "private_subnets" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.moamalat_vpc.id]
  }
  
  filter {
    name   = "subnet-id"
    values = ["subnet-01859110d63358d8f", "subnet-03b9c8ef4c78431c5"]
  }
}

# Security group for Lambda functions
resource "aws_security_group" "lambda_sg" {
  name_prefix = "moamalat-lambda-sg"
  vpc_id      = data.aws_vpc.moamalat_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.moamalat_vpc.cidr_block]
  }

  tags = {
    Name        = "MOAMALAT Lambda Security Group"
    Environment = var.environment
    Project     = "MOAMALAT SaaS"
  }
}

# Lambda function for tenant registration
resource "aws_lambda_function" "tenant_registration" {
  filename         = "lambda-registration.zip"
  function_name    = "moamalat-tenant-registration"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30

  vpc_config {
    subnet_ids         = data.aws_subnets.private_subnets.ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  environment {
    variables = {
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
      COGNITO_CLIENT_ID    = var.cognito_client_id
      SES_FROM_EMAIL       = var.ses_from_email
      # Database variables temporarily removed for migration
      # RDS_ENDPOINT         = local.db_credentials.host
      # DB_USER              = local.db_credentials.username
      # DB_PASSWORD          = local.db_credentials.password
    }
  }

  tags = {
    Name        = "MOAMALAT Tenant Registration"
    Environment = var.environment
    Project     = "MOAMALAT SaaS"
  }
}

# Lambda function for tenant info
resource "aws_lambda_function" "tenant_info" {
  filename         = "lambda-tenant-info.zip"
  function_name    = "moamalat-tenant-info"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30

  vpc_config {
    subnet_ids         = data.aws_subnets.private_subnets.ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  environment {
    variables = {
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
      # Database variables temporarily removed for migration
      # RDS_ENDPOINT         = local.db_credentials.host
      # DB_USER              = local.db_credentials.username
      # DB_PASSWORD          = local.db_credentials.password
    }
  }

  tags = {
    Name        = "MOAMALAT Tenant Info"
    Environment = var.environment
    Project     = "MOAMALAT SaaS"
  }
}

# API Gateway
resource "aws_api_gateway_rest_api" "moamalat_api" {
  name        = "moamalat-admin-api"
  description = "API for MOAMALAT Admin Portal"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# API Gateway Resources
resource "aws_api_gateway_resource" "api" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  parent_id   = aws_api_gateway_rest_api.moamalat_api.root_resource_id
  path_part   = "api"
}

resource "aws_api_gateway_resource" "registration" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "registration"
}

resource "aws_api_gateway_resource" "tenant_registration" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  parent_id   = aws_api_gateway_resource.registration.id
  path_part   = "tenant"
}

resource "aws_api_gateway_resource" "tenant" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "tenant"
}

resource "aws_api_gateway_resource" "tenant_info" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  parent_id   = aws_api_gateway_resource.tenant.id
  path_part   = "info"
}

# API Gateway Methods
resource "aws_api_gateway_method" "tenant_registration_post" {
  rest_api_id   = aws_api_gateway_rest_api.moamalat_api.id
  resource_id   = aws_api_gateway_resource.tenant_registration.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "tenant_registration_options" {
  rest_api_id   = aws_api_gateway_rest_api.moamalat_api.id
  resource_id   = aws_api_gateway_resource.tenant_registration.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "tenant_info_get" {
  rest_api_id   = aws_api_gateway_rest_api.moamalat_api.id
  resource_id   = aws_api_gateway_resource.tenant_info.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "tenant_info_options" {
  rest_api_id   = aws_api_gateway_rest_api.moamalat_api.id
  resource_id   = aws_api_gateway_resource.tenant_info.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# API Gateway Integrations
resource "aws_api_gateway_integration" "tenant_registration_post" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  resource_id = aws_api_gateway_resource.tenant_registration.id
  http_method = aws_api_gateway_method.tenant_registration_post.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.tenant_registration.invoke_arn
}

resource "aws_api_gateway_integration" "tenant_registration_options" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  resource_id = aws_api_gateway_resource.tenant_registration.id
  http_method = aws_api_gateway_method.tenant_registration_options.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_integration" "tenant_info_get" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  resource_id = aws_api_gateway_resource.tenant_info.id
  http_method = aws_api_gateway_method.tenant_info_get.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.tenant_info.invoke_arn
}

resource "aws_api_gateway_integration" "tenant_info_options" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  resource_id = aws_api_gateway_resource.tenant_info.id
  http_method = aws_api_gateway_method.tenant_info_options.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

# Method responses for OPTIONS
resource "aws_api_gateway_method_response" "tenant_registration_options" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  resource_id = aws_api_gateway_resource.tenant_registration.id
  http_method = aws_api_gateway_method.tenant_registration_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_method_response" "tenant_info_options" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  resource_id = aws_api_gateway_resource.tenant_info.id
  http_method = aws_api_gateway_method.tenant_info_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# Integration responses for OPTIONS
resource "aws_api_gateway_integration_response" "tenant_registration_options" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  resource_id = aws_api_gateway_resource.tenant_registration.id
  http_method = aws_api_gateway_method.tenant_registration_options.http_method
  status_code = aws_api_gateway_method_response.tenant_registration_options.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.tenant_registration_options]
}

resource "aws_api_gateway_integration_response" "tenant_info_options" {
  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id
  resource_id = aws_api_gateway_resource.tenant_info.id
  http_method = aws_api_gateway_method.tenant_info_options.http_method
  status_code = aws_api_gateway_method_response.tenant_info_options.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.tenant_info_options]
}

# Lambda permissions for API Gateway
resource "aws_lambda_permission" "tenant_registration" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tenant_registration.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.moamalat_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "tenant_info" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tenant_info.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.moamalat_api.execution_arn}/*/*"
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "api" {
  depends_on = [
    aws_api_gateway_integration.tenant_registration_post,
    aws_api_gateway_integration.tenant_registration_options,
    aws_api_gateway_integration.tenant_info_get,
    aws_api_gateway_integration.tenant_info_options,
    aws_api_gateway_integration_response.tenant_registration_options,
    aws_api_gateway_integration_response.tenant_info_options,
  ]

  rest_api_id = aws_api_gateway_rest_api.moamalat_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.api.id,
      aws_api_gateway_resource.registration.id,
      aws_api_gateway_resource.tenant_registration.id,
      aws_api_gateway_resource.tenant.id,
      aws_api_gateway_resource.tenant_info.id,
      aws_api_gateway_method.tenant_registration_post.id,
      aws_api_gateway_method.tenant_registration_options.id,
      aws_api_gateway_method.tenant_info_get.id,
      aws_api_gateway_method.tenant_info_options.id,
      aws_api_gateway_integration.tenant_registration_post.id,
      aws_api_gateway_integration.tenant_registration_options.id,
      aws_api_gateway_integration.tenant_info_get.id,
      aws_api_gateway_integration.tenant_info_options.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# API Gateway Stage
resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.api.id
  rest_api_id   = aws_api_gateway_rest_api.moamalat_api.id
  stage_name    = "prod"
}

# Amplify App for Admin Portal
resource "aws_amplify_app" "admin_portal" {
  name       = "moamalat-admin-portal"
  repository = var.github_repository
  access_token = var.github_token

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - rm -rf node_modules package-lock.json
            - npm install
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
  EOT

  environment_variables = {
    VITE_COGNITO_USER_POOL_ID = var.cognito_user_pool_id
    VITE_COGNITO_CLIENT_ID    = var.cognito_client_id
    VITE_COGNITO_REGION       = var.aws_region
    VITE_API_ENDPOINT         = "https://${aws_api_gateway_rest_api.moamalat_api.id}.execute-api.${var.aws_region}.amazonaws.com/prod"
    VITE_MOAMALAT_APP_URL     = var.moamalat_app_url
  }

  tags = {
    Name        = "MOAMALAT Admin Portal"
    Environment = var.environment
    Project     = "MOAMALAT SaaS"
  }
}

# Amplify Branch
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.admin_portal.id
  branch_name = "main"
  framework   = "React"
  stage       = "PRODUCTION"
  enable_auto_build = true
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "moamalat-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for Lambda
resource "aws_iam_role_policy" "lambda_policy" {
  name = "moamalat-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminSetUserAttributes",
          "cognito-idp:GetUser"
        ]
        Resource = "arn:aws:cognito-idp:${var.aws_region}:*:userpool/${var.cognito_user_pool_id}"
      },
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = data.aws_secretsmanager_secret.database.arn
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface"
        ]
        Resource = "*"
      }
    ]
  })
}

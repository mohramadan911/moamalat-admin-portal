# Tenant Provisioning Lambda Function
resource "aws_lambda_function" "tenant_provisioning" {
  filename         = "tenant-provisioning.zip"
  function_name    = "moamalat-tenant-provisioning"
  role            = aws_iam_role.tenant_provisioning_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 300
  memory_size      = 512

  vpc_config {
    subnet_ids         = data.aws_subnets.private_subnets.ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  environment {
    variables = {
      ECS_CLUSTER_NAME    = var.ecs_cluster_name
      ALB_ARN            = var.alb_arn
      ROUTE53_ZONE_ID    = var.route53_zone_id
      DOMAIN_NAME        = var.domain_name
      TENANTS_TABLE      = aws_dynamodb_table.tenants.name
      VPC_ID             = var.vpc_id
      PRIVATE_SUBNET_IDS = join(",", var.private_subnet_ids)
    }
  }

  tags = {
    Name        = "MOAMALAT Tenant Provisioning"
    Environment = var.environment
    Project     = "MOAMALAT SaaS"
  }
}

# Status Checker Lambda Function
resource "aws_lambda_function" "tenant_status_checker" {
  filename         = "tenant-status-checker.zip"
  function_name    = "moamalat-tenant-status-checker"
  role            = aws_iam_role.tenant_provisioning_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 60

  vpc_config {
    subnet_ids         = data.aws_subnets.private_subnets.ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  environment {
    variables = {
      ECS_CLUSTER_NAME = var.ecs_cluster_name
      TENANTS_TABLE    = aws_dynamodb_table.tenants.name
    }
  }

  tags = {
    Name        = "MOAMALAT Tenant Status Checker"
    Environment = var.environment
    Project     = "MOAMALAT SaaS"
  }
}

# IAM Role for Tenant Provisioning Lambda
resource "aws_iam_role" "tenant_provisioning_role" {
  name = "moamalat-tenant-provisioning-role"

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

# IAM Policy for Tenant Provisioning Lambda
resource "aws_iam_role_policy" "tenant_provisioning_policy" {
  name = "VPCAccessPolicy"
  role = aws_iam_role.tenant_provisioning_role.id

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
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeVpcs",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecs:*"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "elasticloadbalancing:*"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "route53:*"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.tenants.arn,
          "${aws_dynamodb_table.tenants.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "rds:*"
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
          "iam:PassRole"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "states:StartExecution"
        ]
        Resource = aws_sfn_state_machine.tenant_provisioning.arn
      },
      {
        Effect = "Allow"
        Action = [
          "acm:RequestCertificate",
          "acm:DescribeCertificate",
          "acm:ListCertificates",
          "acm:AddTagsToCertificate"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:FilterLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Resource = "*"
      }
    ]
  })
}

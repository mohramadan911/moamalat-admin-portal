# Registration System Infrastructure (without duplicate Lambda)
resource "aws_ses_email_identity" "sender_email" {
  email = "mohamed.issa@dataserve.com.sa"
}

# DynamoDB table for tenant registrations
resource "aws_dynamodb_table" "tenant_registrations" {
  name           = "tenant-registrations"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "email"
  range_key      = "registrationDate"

  attribute {
    name = "email"
    type = "S"
  }

  attribute {
    name = "registrationDate"
    type = "S"
  }

  tags = {
    Name        = "MOAMALAT Tenant Registrations"
    Environment = "production"
    Project     = "MOAMALAT SaaS"
  }
}

# IAM role policy for Lambda with SES and DynamoDB permissions
resource "aws_iam_role_policy" "lambda_registration_policy" {
  name = "lambda-registration-policy"
  role = "moamalat-lambda-role"  # Existing role

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
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
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query"
        ]
        Resource = aws_dynamodb_table.tenant_registrations.arn
      },
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminSetUserAttributes"
        ]
        Resource = "arn:aws:cognito-idp:us-east-1:*:userpool/us-east-1_oM7CNtGJs"
      }
    ]
  })
}

# Output important values
output "dynamodb_table_name" {
  value = aws_dynamodb_table.tenant_registrations.name
}

output "ses_email_identity" {
  value = aws_ses_email_identity.sender_email.email
}

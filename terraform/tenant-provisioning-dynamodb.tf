# DynamoDB table for tenant tracking
resource "aws_dynamodb_table" "tenants" {
  name           = "tenants"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "tenant_id"

  attribute {
    name = "tenant_id"
    type = "S"
  }

  attribute {
    name = "subdomain"
    type = "S"
  }

  global_secondary_index {
    name     = "subdomain-index"
    hash_key = "subdomain"
    projection_type = "ALL"
  }

  tags = {
    Name        = "MOAMALAT Tenants"
    Environment = var.environment
    Project     = "MOAMALAT SaaS"
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  type        = string
}

variable "cognito_client_id" {
  description = "Cognito Client ID"
  type        = string
}

variable "ses_from_email" {
  description = "SES from email address"
  type        = string
}

variable "moamalat_app_url" {
  description = "MOAMALAT main application URL"
  type        = string
}

variable "github_repository" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/mohramadan911/moamalat-admin-portal"
}

variable "github_token" {
  description = "GitHub personal access token for Amplify"
  type        = string
  sensitive   = true
}

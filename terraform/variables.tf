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

variable "github_repository" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/your-org/moamalat-admin-portal"
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  type        = string
  default     = "eu-central-1_jySRFiUE7"
}

variable "cognito_client_id" {
  description = "Cognito App Client ID"
  type        = string
  default     = "7n05sv22gj99sbuir8qjgg7r10"
}

variable "moamalat_app_url" {
  description = "MOAMALAT business app URL"
  type        = string
  default     = "https://app.moamalat.app"
}

variable "ses_from_email" {
  description = "SES from email address"
  type        = string
  default     = "noreply@moamalat.app"
}

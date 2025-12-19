output "amplify_app_id" {
  description = "Amplify App ID"
  value       = aws_amplify_app.admin_portal.id
}

output "amplify_default_domain" {
  description = "Amplify default domain"
  value       = aws_amplify_app.admin_portal.default_domain
}

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = "https://${aws_api_gateway_rest_api.moamalat_api.id}.execute-api.${var.aws_region}.amazonaws.com/prod"
}

output "tenant_registration_endpoint" {
  description = "Tenant registration API endpoint"
  value       = "https://${aws_api_gateway_rest_api.moamalat_api.id}.execute-api.${var.aws_region}.amazonaws.com/prod/api/registration/tenant"
}

output "tenant_info_endpoint" {
  description = "Tenant info API endpoint"
  value       = "https://${aws_api_gateway_rest_api.moamalat_api.id}.execute-api.${var.aws_region}.amazonaws.com/prod/api/tenant/info"
}

output "lambda_registration_function_name" {
  description = "Lambda function name for tenant registration"
  value       = aws_lambda_function.tenant_registration.function_name
}

output "lambda_tenant_info_function_name" {
  description = "Lambda function name for tenant info"
  value       = aws_lambda_function.tenant_info.function_name
}

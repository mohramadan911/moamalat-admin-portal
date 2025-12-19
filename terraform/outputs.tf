output "api_gateway_url" {
  description = "API Gateway URL"
  value       = "https://${aws_api_gateway_rest_api.moamalat_api.id}.execute-api.${var.aws_region}.amazonaws.com/prod"
}

output "lambda_registration_function_name" {
  description = "Lambda function name for tenant registration"
  value       = aws_lambda_function.tenant_registration.function_name
}

output "lambda_tenant_info_function_name" {
  description = "Lambda function name for tenant info"
  value       = aws_lambda_function.tenant_info.function_name
}

output "amplify_app_id" {
  description = "Amplify App ID"
  value       = aws_amplify_app.admin_portal.id
}

output "amplify_default_domain" {
  description = "Amplify default domain"
  value       = aws_amplify_app.admin_portal.default_domain
}

output "amplify_app_url" {
  description = "Amplify App URL"
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.admin_portal.default_domain}"
}

# Additional outputs for tenant provisioning
output "tenant_provisioning_lambda_arn" {
  description = "Tenant Provisioning Lambda function ARN"
  value       = aws_lambda_function.tenant_provisioning.arn
}

output "tenant_status_checker_lambda_arn" {
  description = "Tenant Status Checker Lambda function ARN"
  value       = aws_lambda_function.tenant_status_checker.arn
}

output "step_function_arn" {
  description = "Step Functions state machine ARN"
  value       = aws_sfn_state_machine.tenant_provisioning.arn
}

output "tenants_table_name" {
  description = "Tenants DynamoDB table name"
  value       = aws_dynamodb_table.tenants.name
}

output "tenants_table_arn" {
  description = "Tenants DynamoDB table ARN"
  value       = aws_dynamodb_table.tenants.arn
}

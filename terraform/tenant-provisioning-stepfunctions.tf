# Step Functions State Machine for Tenant Provisioning
resource "aws_sfn_state_machine" "tenant_provisioning" {
  name     = "moamalat-tenant-provisioning"
  role_arn = aws_iam_role.step_functions_role.arn

  definition = jsonencode({
    Comment = "Tenant Provisioning Workflow"
    StartAt = "ValidateInput"
    States = {
      ValidateInput = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "validate"
          "input.$" = "$"
        }
        Next = "CreateDNSRecord"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 6
            BackoffRate = 2
          }
        ]
      }
      CreateDNSRecord = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "create_dns"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "CreateDatabaseSchema"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      CreateDatabaseSchema = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "create_schema"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "CreateSSLCertificate"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      CreateSSLCertificate = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "create_certificate"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "CreateBackendTaskDefinition"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      CreateBackendTaskDefinition = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "create_backend_task_definition"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "CreateBackendTargetGroup"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      CreateBackendTargetGroup = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "create_backend_target_group"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "CreateBackendALBRule"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      CreateBackendALBRule = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "create_backend_alb_rule"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "DeployBackendService"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      DeployBackendService = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "deploy_backend"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "WaitForBackend"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      WaitForBackend = {
        Type = "Pass"
        Parameters = {
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
          "backend_service_arn.$" = "$.backend_service_arn"
          "retry_count" = 0
        }
        Next = "WaitForBackendTime"
      }
      WaitForBackendTime = {
        Type = "Wait"
        Seconds = 240
        Next = "CheckBackendLogs"
      }
      CheckBackendLogs = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_status_checker.arn
        Parameters = {
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
          check_type = "backend_logs"
        }
        Next = "BackendHealthChoice"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      IncrementRetryCount = {
        Type = "Pass"
        Parameters = {
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
          "status.$" = "$.status"
          "reason.$" = "$.reason"
          "retry_count.$" = "States.MathAdd($.retry_count, 1)"
        }
        Next = "CheckRetryLimit"
      }
      CheckRetryLimit = {
        Type = "Choice"
        Choices = [
          {
            Variable = "$.retry_count"
            NumericGreaterThan = 5
            Next = "BackendFailed"
          }
        ]
        Default = "WaitForBackendRetry"
      }
      WaitForBackendRetry = {
        Type = "Wait"
        Seconds = 30
        Next = "CheckBackendLogs"
      }
      BackendHealthChoice = {
        Type = "Choice"
        Choices = [
          {
            Variable = "$.status"
            StringEquals = "healthy"
            Next = "PrepareForFrontend"
          },
          {
            Variable = "$.status"
            StringEquals = "unhealthy"
            Next = "IncrementRetryCount"
          }
        ]
        Default = "IncrementRetryCount"
      }
      PrepareForFrontend = {
        Type = "Pass"
        Parameters = {
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
          "status.$" = "$.status"
          "message.$" = "$.message"
        }
        Next = "CreateFrontendTaskDefinition"
      }
      CreateFrontendTaskDefinition = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "create_frontend_task_definition"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "CreateFrontendTargetGroup"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      CreateFrontendTargetGroup = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "create_frontend_target_group"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "CreateFrontendALBRule"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      CreateFrontendALBRule = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "create_frontend_alb_rule"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "DeployFrontendService"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      DeployFrontendService = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "deploy_frontend"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        Next = "WaitForFrontend"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      WaitForFrontend = {
        Type = "Wait"
        Seconds = 60
        Next = "CheckFrontendHealth"
      }
      CheckFrontendHealth = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_status_checker.arn
        Parameters = {
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
          check_type = "frontend"
        }
        Next = "FrontendHealthChoice"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      FrontendHealthChoice = {
        Type = "Choice"
        Choices = [
          {
            Variable = "$.status"
            StringEquals = "healthy"
            Next = "ProvisioningComplete"
          },
          {
            Variable = "$.status"
            StringEquals = "unhealthy"
            Next = "FrontendFailed"
          }
        ]
        Default = "WaitForFrontend"
      }
      ProvisioningComplete = {
        Type = "Task"
        Resource = aws_lambda_function.tenant_provisioning.arn
        Parameters = {
          action = "finalize"
          "tenant_id.$" = "$.tenant_id"
          "subdomain.$" = "$.subdomain"
        }
        End = true
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
      }
      BackendFailed = {
        Type = "Fail"
        Cause = "Backend service failed to start"
      }
      FrontendFailed = {
        Type = "Fail"
        Cause = "Frontend service failed to start"
      }
    }
  })

  tags = {
    Name        = "MOAMALAT Tenant Provisioning"
    Environment = var.environment
    Project     = "MOAMALAT SaaS"
  }
}

# IAM Role for Step Functions
resource "aws_iam_role" "step_functions_role" {
  name = "moamalat-step-functions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "states.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for Step Functions
resource "aws_iam_role_policy" "step_functions_policy" {
  name = "moamalat-step-functions-policy"
  role = aws_iam_role.step_functions_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = [
          aws_lambda_function.tenant_provisioning.arn,
          aws_lambda_function.tenant_status_checker.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:CreateLogDelivery",
          "logs:GetLogDelivery",
          "logs:UpdateLogDelivery",
          "logs:DeleteLogDelivery",
          "logs:ListLogDeliveries",
          "logs:PutResourcePolicy",
          "logs:DescribeResourcePolicies",
          "logs:DescribeLogGroups"
        ]
        Resource = "*"
      }
    ]
  })
}

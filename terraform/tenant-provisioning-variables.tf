# Additional variables for tenant provisioning
variable "vpc_id" {
  description = "VPC ID for resources"
  type        = string
  default     = "vpc-074fbfda710f9a931"
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
  default     = ["subnet-03b9c8ef4c78431c5", "subnet-01859110d63358d8f"]
}

variable "ecs_cluster_name" {
  description = "ECS cluster name"
  type        = string
  default     = "moamalat-cluster"
}

variable "alb_arn" {
  description = "Application Load Balancer ARN"
  type        = string
  default     = "arn:aws:elasticloadbalancing:us-east-1:339712855370:loadbalancer/app/moamalat-alb/25303afaeb8924d6"
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
  default     = "Z01557883SJQKW0ELRWJQ"
}

variable "domain_name" {
  description = "Domain name for tenants"
  type        = string
  default     = "moamalat-pro.com"
}

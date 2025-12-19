terraform {
  backend "s3" {
    bucket = "moamalat-saas-documents-339712855370"
    key    = "terraform/admin-portal/terraform.tfstate"
    region = "eu-central-1"
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  required_version = ">= 1.0"
}

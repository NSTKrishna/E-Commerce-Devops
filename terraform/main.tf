terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1" # You can change this to your preferred region
}

# Generate a random suffix to ensure the bucket name is unique
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# 1. Create the S3 Bucket with a unique name
resource "aws_s3_bucket" "app_bucket" {
  bucket = "ecommerce-app-data-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "E-Commerce Application Bucket"
    Environment = "Dev"
  }
}

# 2. Enable Versioning
resource "aws_s3_bucket_versioning" "app_bucket_versioning" {
  bucket = aws_s3_bucket.app_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# 3. Enable Server-Side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "app_bucket_encryption" {
  bucket = aws_s3_bucket.app_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 4. Block Public Access
resource "aws_s3_bucket_public_access_block" "app_bucket_public_access_block" {
  bucket = aws_s3_bucket.app_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Output the generated bucket name
output "bucket_name" {
  description = "The name of the created S3 bucket"
  value       = aws_s3_bucket.app_bucket.bucket
}

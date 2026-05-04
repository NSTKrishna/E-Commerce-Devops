# Subnet IDs for ECS Fargate services
# Find these in AWS Console → VPC → Subnets (use any 2 public subnets from the default VPC)
variable "subnet_ids" {
  description = "List of subnet IDs for ECS services"
  type        = list(string)
  default     = []
}

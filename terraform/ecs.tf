# --- ECR Repositories (referenced as data sources) ---
# Repos are created via AWS CLI in the workflow (idempotent)
data "aws_ecr_repository" "server" {
  name = "ecommerce-server"
}

data "aws_ecr_repository" "client" {
  name = "ecommerce-client"
}

# --- ECS Cluster ---
resource "aws_ecs_cluster" "main" {
  name = "ecommerce-cluster"
}

# --- IAM: Use pre-existing AWS Academy LabRole ---
# AWS Academy blocks iam:CreateRole, so we reference the existing LabRole
data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

# --- Security Group (referenced as data source) ---
# SG is created via AWS CLI in the workflow (idempotent)
data "aws_security_group" "ecs_sg" {
  name = "ecommerce-ecs-sg"
}

# Subnets are provided via var.subnet_ids (AWS Academy blocks ec2:Describe* calls)

# --- Server Task Definition & Service ---
resource "aws_ecs_task_definition" "server" {
  family                   = "ecommerce-server-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([
    {
      name      = "server"
      image     = "${data.aws_ecr_repository.server.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "PORT", value = "5000" }
      ]
    }
  ])
}

resource "aws_ecs_service" "server_service" {
  name            = "ecommerce-server-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.server.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [data.aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
}

# --- Client Task Definition & Service ---
resource "aws_ecs_task_definition" "client" {
  family                   = "ecommerce-client-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([
    {
      name      = "client"
      image     = "${data.aws_ecr_repository.client.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "PORT", value = "3000" }
      ]
    }
  ])
}

resource "aws_ecs_service" "client_service" {
  name            = "ecommerce-client-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.client.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [data.aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
}

# --- Outputs ---
output "ecr_server_url" {
  description = "The URL of the Server ECR repository"
  value       = data.aws_ecr_repository.server.repository_url
}

output "ecr_client_url" {
  description = "The URL of the Client ECR repository"
  value       = data.aws_ecr_repository.client.repository_url
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

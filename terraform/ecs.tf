# --- ECR Repositories ---
resource "aws_ecr_repository" "server" {
  name                 = "ecommerce-server"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "client" {
  name                 = "ecommerce-client"
  image_tag_mutability = "MUTABLE"
}

# --- ECS Cluster ---
resource "aws_ecs_cluster" "main" {
  name = "ecommerce-cluster"
}

# --- IAM Roles for ECS ---
# Task Execution Role (allows ECS to pull images and write logs)
resource "aws_iam_role" "ecs_execution_role" {
  name = "ecommerce-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# --- Security Group ---
# Allows inbound traffic for the server and client
resource "aws_security_group" "ecs_sg" {
  name        = "ecommerce-ecs-sg"
  description = "Allow inbound traffic for server and client"

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Subnets are provided via var.subnet_ids (AWS Academy blocks ec2:Describe* calls)

# --- Server Task Definition & Service ---
resource "aws_ecs_task_definition" "server" {
  family                   = "ecommerce-server-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "server"
      image     = "${aws_ecr_repository.server.repository_url}:latest"
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
      # Logs configuration can be added here
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
    security_groups  = [aws_security_group.ecs_sg.id]
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
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "client"
      image     = "${aws_ecr_repository.client.repository_url}:latest"
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
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
}

# --- Outputs ---
output "ecr_server_url" {
  description = "The URL of the Server ECR repository"
  value       = aws_ecr_repository.server.repository_url
}

output "ecr_client_url" {
  description = "The URL of the Client ECR repository"
  value       = aws_ecr_repository.client.repository_url
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

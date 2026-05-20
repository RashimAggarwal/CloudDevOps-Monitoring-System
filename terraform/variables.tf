variable "project_name" {
  description = "Project name used for AWS resource names and tags."
  type        = string
  default     = "cloudshield"
}

variable "aws_region" {
  description = "AWS region where the EC2 instance will be created."
  type        = string
  default     = "us-east-1"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance. Use an Amazon Linux 2023 AMI in your selected region."
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type for the DevOps demo host."
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Existing AWS EC2 key pair name for SSH access."
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into the EC2 instance."
  type        = string
  default     = "0.0.0.0/0"
}

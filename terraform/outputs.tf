output "instance_public_ip" {
  description = "Public IP address of the CloudShield EC2 instance."
  value       = aws_instance.cloudshield.public_ip
}

output "frontend_url" {
  description = "Frontend URL after Docker Compose is started on the instance."
  value       = "http://${aws_instance.cloudshield.public_ip}:3000"
}

output "grafana_url" {
  description = "Grafana URL after Docker Compose is started on the instance."
  value       = "http://${aws_instance.cloudshield.public_ip}:3001"
}

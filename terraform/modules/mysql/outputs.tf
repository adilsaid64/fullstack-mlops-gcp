output "instance_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.db_instance_endpoint
}

output "db_instance_master_user_secret_arn" {
  description = "Secrets Manager ARN for master user"
  value       = module.rds.db_instance_master_user_secret_arn
}

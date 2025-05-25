output "vpc_id" {
  description = "The ID of the created VPC"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "List of private subnets"
  value       = module.vpc.private_subnets
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "db_subnet_group_name" {
  description = "Subnet group name for RDS, created from private subnets"
  value       = aws_db_subnet_group.this.name
}

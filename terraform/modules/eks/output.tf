output "cluster_name" {
  description = "cluster name"
  value       = module.eks.cluster_name
}

output "cluster_primary_security_group_id" {
  description = "The cluster's primary security group ID"
  value       = module.eks.cluster_primary_security_group_id
}

output "node_security_group_id" {
  description = "The EKS node security group ID"
  value       = module.eks.node_security_group_id
}

output "cluster_service_cidr" {
  value = module.eks.cluster_service_cidr
}


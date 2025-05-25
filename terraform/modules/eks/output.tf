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

output "eks_cluster_endpoint" {
  description = "The EKS cluster API server endpoint"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_ca_certificate" {
  description = "The base64 encoded certificate data required to communicate with the cluster"
  value       = module.eks.cluster_certificate_authority_data
}

output "eks_cluster_token" {
  description = "Temporary authentication token for Kubernetes provider"
  value       = data.aws_eks_cluster_auth.this.token
  sensitive   = true
}

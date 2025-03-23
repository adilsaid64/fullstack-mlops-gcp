include {
  path = find_in_parent_folders("root.hcl")
}

dependency "eks" {
  config_path = "../eks"
}

dependency "vpc" {
  config_path = "../vpc"
}

terraform {
  source = "../../../modules/node_group"
}

inputs = {
  node_group_name = "dev-mlops-group"
  cluster_name    = dependency.eks.outputs.cluster_name
  cluster_version = "1.31"
  cluster_service_cidr = dependency.eks.outputs.cluster_service_cidr
  private_subnets = dependency.vpc.outputs.private_subnets
  desired_size    = 1
  max_size        = 1
  min_size        = 1
  instance_types  = ["t3.medium"]

  tags = {
    Environment = "dev"
    Project     = "mlops"
    Terraform   = "true"
  }
  node_security_group_id = dependency.eks.outputs.node_security_group_id
  cluster_primary_security_group_id = dependency.eks.outputs.cluster_primary_security_group_id

}

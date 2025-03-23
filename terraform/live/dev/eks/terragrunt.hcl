include {
  path = find_in_parent_folders("root.hcl")
}

dependency "vpc" {
  config_path = "../vpc"
}


terraform {
  source = "../../../modules/eks"
}

inputs = {
  cluster_name    = "dev-mlops-cluster"
  vpc_id          = dependency.vpc.outputs.vpc_id
  private_subnets = dependency.vpc.outputs.private_subnets
  cluster_version = "1.31"

  tags = {
    Environment = "dev"
    Project     = "mlops"
    Terraform   = "true"
  }
}

include {
  path = find_in_parent_folders("root.hcl")
}

dependency "eks" {
  config_path = "../eks"
}

dependency "mysql" {
  config_path = "../mysql"
}

terraform {
  source = "../../../modules/mlflow"
}

inputs = {
  name_prefix            = "fullstack-mlops"
  db_instance_master_user_secret_arn = dependency.mysql.outputs.db_instance_master_user_secret_arn
  db_instance_endpoint  = dependency.mysql.outputs.instance_endpoint
  cluster_endpoint = dependency.eks.outputs.eks_cluster_endpoint
  cluster_ca       = dependency.eks.outputs.eks_cluster_ca_certificate
  cluster_token    = dependency.eks.outputs.eks_cluster_token
  cluster_name     = dependency.eks.outputs.cluster_name

  tags = {
    Environment = "dev"
    Project     = "mlops"
    Terraform   = "true"
  }
}

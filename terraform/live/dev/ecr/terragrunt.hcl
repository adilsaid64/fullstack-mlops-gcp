include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules/ecr"
}

inputs = {
  ecr_repo_name    = "dev-mlops-ecr-repo"

  tags = {
    Environment = "dev"
    Project     = "mlops"
    Terraform   = "true"
  }
}

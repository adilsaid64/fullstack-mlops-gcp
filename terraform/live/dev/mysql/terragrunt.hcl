include {
  path = find_in_parent_folders("root.hcl")
}

dependency "vpc" {
  config_path = "../vpc"
}

terraform {
  source = "../../../modules/mysql"
}

inputs = {
  identifier            = "dev-mlops-db"
  db_name               = "mlflow" // for mlflow db
  db_subnet_group_name  = dependency.vpc.outputs.db_subnet_group_name
  vpc_id                = dependency.vpc.outputs.vpc_id
  vpc_cidr_block        = dependency.vpc.outputs.vpc_cidr_block

  tags = {
    Environment = "dev"
    Project     = "mlops"
    Terraform   = "true"
  }
}

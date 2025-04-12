include {
  path = find_in_parent_folders("root.hcl")
}


terraform {
  source = "../../../modules/s3"
}

inputs = {
  bucket_name    = "dev-mlflow-full-stack-mlops"

  tags = {
    Environment = "dev"
    Project     = "mlops"
    Terraform   = "true"
  }
}

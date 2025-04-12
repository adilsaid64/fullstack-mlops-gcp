include {
  path = find_in_parent_folders("root.hcl")
}


terraform {
  source = "../../../modules/s3"
}

inputs = {
  bucket_name    = "dev-zenml-full-stack-mlops"

  tags = {
    Environment = "dev"
    Project     = "mlops"
    Terraform   = "true"
  }
}

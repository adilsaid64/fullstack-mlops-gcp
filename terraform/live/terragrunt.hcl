remote_state {
  backend = "s3"
  config = {
    bucket         = "terraform-state-full-stack-mlops"
    key            = "${path_relative_to_include()}/terraform.tfstate"
    region         = "eu-west-2"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
provider "aws" {
  region = "eu-west-2"
}
EOF
}

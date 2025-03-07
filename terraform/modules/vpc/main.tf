module "vpc" {
  # using the official aws vpc module from terraform registry
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  # vpc name and cidr block, so vpc has ip address ranging from 10.0.0.0 to 10.0.255.255 
  name = "mlops-vpc"
  cidr = "10.0.0.0/16"

  # 
  enable_dns_support   = true
  enable_dns_hostnames = true

  azs             = ["eu-west-2a", "eu-west-2b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]

  # allows private subnets to access the internet
  enable_nat_gateway = true
  single_nat_gateway = true # creates only a single nat gateway

  tags = {
    Environment = "dev"
    Project     = "MLOps"
  }
}

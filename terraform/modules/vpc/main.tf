terraform {
  backend "s3" {}
}

module "vpc" {
  # using the official aws vpc module from terraform registry
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  # vpc name and cidr block, so vpc has ip address ranging from 10.0.0.0 to 10.0.255.255
  name = var.vpc_name
  cidr = var.cidr

  enable_dns_support   = true
  enable_dns_hostnames = true

  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  # allows private subnets to access the internet
  enable_nat_gateway = true
  single_nat_gateway = true # creates only a single nat gateway

  tags = var.tags
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.vpc_name}-db-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = var.tags
}

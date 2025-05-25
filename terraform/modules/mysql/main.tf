terraform {
  backend "s3" {}
}

module "rds_security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 5.0"

  name        = "${var.identifier}-rds"
  description = "Allow MySQL access from within the VPC"
  vpc_id      = var.vpc_id

  ingress_with_cidr_blocks = [
    {
      from_port   = 3306
      to_port     = 3306
      protocol    = "tcp"
      description = "MySQL access from within VPC"
      cidr_blocks = var.vpc_cidr_block
    },
  ]

  tags = var.tags
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.5.5"

  identifier = var.identifier

  engine               = "mysql"
  engine_version       = "8.0"
  family               = "mysql8.0"
  major_engine_version = "8.0"
  instance_class       = "db.t4g.micro"
  allocated_storage    = 20

  db_name                              = var.db_name
  username                             = "user"
  manage_master_user_password          = true
  manage_master_user_password_rotation = false

  iam_database_authentication_enabled = true

  db_subnet_group_name   = var.db_subnet_group_name
  vpc_security_group_ids = [module.rds_security_group.security_group_id]

  tags = var.tags
}

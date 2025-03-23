terraform {
  backend "s3" {}
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.31"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnets

  cluster_endpoint_public_access  = true # keep api private
  enable_irsa                     = true # allow aws integrations
  cluster_endpoint_private_access = true

  # Adds the current caller identity as an administrator via cluster access entry
  enable_cluster_creator_admin_permissions = true

  # cluster_compute_config = {
  #   enabled    = true
  #   node_pools = ["general-purpose"]
  # }

  # # run  terragrunt run-all apply first, then uncomment lines 28-32 and run the command again
  # # because to install addons, eks needs to be provisioned first
  # cluster_addons = {
  #   coredns    = { resolve_conflicts = "OVERWRITE" }
  #   kube-proxy = { resolve_conflicts = "OVERWRITE" }
  #   vpc-cni    = { resolve_conflicts = "OVERWRITE" }
  # }

  tags = merge(
    {
      "Name"      = var.cluster_name
      "Terraform" = "true"
    },
    var.tags
  )
}

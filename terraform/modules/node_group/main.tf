terraform {
  backend "s3" {}
}

module "eks_managed_node_group" {
  source = "terraform-aws-modules/eks/aws//modules/eks-managed-node-group"

  name            = var.node_group_name
  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  subnet_ids = var.private_subnets

  cluster_primary_security_group_id = var.cluster_primary_security_group_id
  vpc_security_group_ids            = [var.node_security_group_id]

  cluster_service_cidr = var.cluster_service_cidr

  min_size     = var.min_size
  max_size     = var.max_size
  desired_size = var.desired_size

  instance_types = var.instance_types
  capacity_type  = "ON_DEMAND"

  labels = var.labels

  tags = merge(
    {
      "Name" = var.node_group_name
    },
    var.tags
  )
}

terraform {
  backend "s3" {}
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.31"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version
  vpc_id          = var.vpc_id
  subnet_ids      = var.private_subnets

  cluster_endpoint_public_access           = true
  enable_irsa                              = true
  cluster_endpoint_private_access          = true
  enable_cluster_creator_admin_permissions = true

  tags = merge(
    {
      "Name"      = var.cluster_name
      "Terraform" = "true"
    },
    var.tags
  )
}

resource "aws_eks_addon" "coredns" {
  cluster_name      = module.eks.cluster_name
  addon_name        = "coredns"
  resolve_conflicts = "OVERWRITE"

  depends_on = [module.eks]
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name      = module.eks.cluster_name
  addon_name        = "kube-proxy"
  resolve_conflicts = "OVERWRITE"

  depends_on = [module.eks]
}

resource "aws_eks_addon" "vpc_cni" {
  cluster_name      = module.eks.cluster_name
  addon_name        = "vpc-cni"
  resolve_conflicts = "OVERWRITE"

  depends_on = [module.eks]
}

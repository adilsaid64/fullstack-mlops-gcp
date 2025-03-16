module "vpc" {
  source = "./modules/vpc"
}

module "eks" {
  source          = "./modules/eks"
  cluster_name    = "mlops-cluster"
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets

  depends_on = [module.vpc]
}

module "node_group" {
  source          = "./modules/node_group"
  node_group_name = "mlops-group"
  private_subnets = module.vpc.private_subnets

  depends_on = [module.eks]
}

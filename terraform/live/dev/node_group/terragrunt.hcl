include {
  path = find_in_parent_folders()
}

dependencies {
  paths = ["../eks"]
}

terraform {
  source = "../../../modules/node_group"
}

inputs = {
  node_group_name = "dev-mlops-group"
  cluster_name    = dependency.eks.outputs.cluster_name
  private_subnets = dependency.eks.outputs.private_subnets
  desired_size    = 1
  max_size        = 1
  min_size        = 1
  instance_types  = ["t3.medium"]
}

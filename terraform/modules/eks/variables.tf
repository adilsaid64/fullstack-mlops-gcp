variable "vpc_id" {
  description = "VPC id where EKS is deployed"
  type        = string
}

variable "private_subnets" {
  description = "List of private subnets for EKS worker nodes"
  type        = list(string)
}

variable "cluster_name" {
  description = "Name of EKS cluster"
  type        = string
}

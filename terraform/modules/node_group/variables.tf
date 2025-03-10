variable "cluster_name" {
  description = "Name of EKS cluster"
  type        = string

}
variable "node_group_name" {
  description = "Name of EKS node group"
  type        = string
}

variable "private_subnets" {
  description = "Private subsets"
  type        = list(string)

}

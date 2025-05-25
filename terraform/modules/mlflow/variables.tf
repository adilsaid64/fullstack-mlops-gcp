variable "name_prefix" {
  description = "The prefix to add to the resource names. Must be S3 name safe!"
  type        = string
}

variable "db_instance_master_user_secret_arn" {
  description = "Secret containing credentials for the backing database."
  type        = string
}

variable "db_instance_endpoint" {
  description = "The backing database endpoint."
  type        = string
}

variable "cluster_name" {
  description = "The EKS cluster name."
  type        = string
}


variable "cluster_endpoint" {
  type = string
}

variable "cluster_ca" {
  type = string
}

variable "cluster_token" {
  type = string
}

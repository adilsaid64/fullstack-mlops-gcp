variable "db_name" {
  description = "Name of the initial database to create"
  type        = string
}

variable "identifier" {
  description = "The prefix to add to the resource names. Must be S3 name safe!"
  type        = string
}

variable "db_subnet_group_name" {
  description = "A database subnet group name."
  type        = string
}

variable "vpc_id" {
  description = "App's VPC ID"
  type        = string
}

variable "vpc_cidr_block" {
  description = "App's VPC CIDR block"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

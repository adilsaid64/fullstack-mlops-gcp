variable "ecr_repo_name" {
  description = "Name of ECR repo"

}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
}

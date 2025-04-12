variable "bucket_name" {
  description = "Name of bucket"
  type        = string
}

variable "tags" {
  description = "Tags to apply to bucket"
  type        = map(string)
  default     = {}
}

terraform {
  backend "s3" {}
}

resource "aws_s3_bucket" "this" {
  bucket        = var.bucket_name
  force_destroy = true

  tags = merge(
    {
      "Name" = var.bucket_name
    },
    var.tags
  )
}

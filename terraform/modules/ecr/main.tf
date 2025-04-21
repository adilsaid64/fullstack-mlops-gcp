terraform {
  backend "s3" {}
}

resource "aws_ecr_repository" "this" {
  name                 = var.ecr_repo_name
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(
    {
      "Name" = var.ecr_repo_name
    },
    var.tags
  )
}

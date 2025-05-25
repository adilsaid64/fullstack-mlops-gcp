resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "helm_release" "lakefs_server" {
  name      = "lakefs-server"
  chart     = "lakefs/lakefs"
  namespace = "zenml"

  set {
    name  = "sectrets.authEncryptSecretKey[0]"
    value = random_password.password.result
  }

  set {
    name  = "service.type"
    value = "ClusterIP"
  }

  set {
    name  = "service.port"
    value = "80"
  }

  set {
    name  = "lakefsConfig"
    value = <<EOF
database:
  type: dynamodb
  dynamodb:
    aws_region: eu-west-2
    aws_access_key_id: ${aws_iam_access_key.iam_user_access_key.id}
    aws_secret_access_key: ${aws_iam_access_key.iam_user_access_key.secret}
blockstore:
  type: s3
  s3:
    region: eu-west-2
    credentials:
      access_key_id: ${aws_iam_access_key.iam_user_access_key.id}
      secret_access_key: ${aws_iam_access_key.iam_user_access_key.secret}
EOF
  }
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "AWS"
      identifiers = [aws_iam_user.iam_user.arn]
    }
  }
}

resource "aws_iam_role" "lakefs_role" {
  name               = "lakefs-${var.name_prefix}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_user" "iam_user" {
  name = "lakefs-${var.name_prefix}"
}

resource "aws_iam_user_policy" "assume_role_policy" {
  name = "AssumeRole"
  user = aws_iam_user.iam_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "sts:AssumeRole"
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_access_key" "iam_user_access_key" {
  user = aws_iam_user.iam_user.name
}

resource "aws_iam_user_policy" "lakefs_dynamodb_policy" {
  name = "LakeFS-DynamoDB-Policy"
  user = aws_iam_user.iam_user.id

  policy = file("${path.module}/lakefs-dynamodb-policy.json")
}

resource "aws_s3_bucket" "lakefs_bucket" {
  bucket = "${var.name_prefix}-lakefs"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_policy" "lakefs_bucket_policy" {
  bucket = aws_s3_bucket.lakefs_bucket.bucket
  policy = data.aws_iam_policy_document.lakefs_bucket_policy.json
}

data "aws_iam_policy_document" "lakefs_bucket_policy" {
  # Allow LakeFS to write to its repo bucket
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:AbortMultipartUpload",
      "s3:ListMultipartUploadParts"
    ]

    effect    = "Allow"
    resources = ["${aws_s3_bucket.lakefs_bucket.arn}/*"]
    principals {
      identifiers = [aws_iam_user.iam_user.arn]
      type        = "AWS"
    }
  }

  # Allow LakeFS to find its repo bucket
  statement {
    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation",
      "s3:ListBucketMultipartUploads"
    ]

    effect    = "Allow"
    resources = [aws_s3_bucket.lakefs_bucket.arn]
    principals {
      identifiers = [aws_iam_user.iam_user.arn]
      type        = "AWS"
    }
  }
}

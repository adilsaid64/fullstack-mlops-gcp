
terraform {
  backend "s3" {}
}

resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "!#$&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "mlflow_admin" {
  name        = "${var.name_prefix}-mlflow-admin"
  description = "Admin credentials for MLflow tracking server"
}

resource "aws_secretsmanager_secret_version" "mlflow_admin_version" {
  secret_id = aws_secretsmanager_secret.mlflow_admin.id
  secret_string = jsonencode({
    username = "admin"
    password = random_password.password.result
  })
}

resource "aws_s3_bucket" "artifact_storage_s3" {
  bucket = "${var.name_prefix}-mlflow"

  lifecycle {
    prevent_destroy = false
  }
}

data "aws_secretsmanager_secret" "rds_master" {
  arn = var.db_instance_master_user_secret_arn
}

data "aws_secretsmanager_secret_version" "rds_master" {
  secret_id = data.aws_secretsmanager_secret.rds_master.id
}

data "aws_eks_cluster" "cluster" {
  name = var.cluster_name
}

provider "kubernetes" {
  host                   = var.cluster_endpoint
  token                  = var.cluster_token
  cluster_ca_certificate = base64decode(var.cluster_ca)
}

provider "helm" {
  kubernetes {
    host                   = var.cluster_endpoint
    token                  = var.cluster_token
    cluster_ca_certificate = base64decode(var.cluster_ca)
  }
}

# create the mlflow tracking server deployment using mlflow helm charts
# Reference: https://github.com/community-charts/helm-charts/blob/main/charts/mlflow/values.yaml
resource "helm_release" "mlflow_tracking" {
  name             = "mlflow-server"
  repository       = "https://community-charts.github.io/helm-charts"
  chart            = "mlflow"
  namespace        = "mlflow"
  create_namespace = true
  force_update     = true

  set {
    name  = "auth.enabled"
    value = true
  }

  set {
    name  = "auth.adminUsername"
    value = "admin"
  }

  set {
    name  = "auth.adminPassword"
    value = random_password.password.result
  }

  set {
    name  = "artifactRoot.s3.enabled"
    value = "true"
  }

  set {
    name  = "artifactRoot.s3.bucket"
    value = aws_s3_bucket.artifact_storage_s3.bucket
  }

  set {
    name  = "backendStore.databaseConnectionCheck"
    value = true
  }

  set {
    name  = "backendStore.mysql.enabled"
    value = true
  }

  set {
    name  = "backendStore.mysql.host"
    value = split(":", var.db_instance_endpoint)[0]
  }

  set {
    name  = "backendStore.mysql.port"
    value = split(":", var.db_instance_endpoint)[1]
  }

  set {
    name  = "backendStore.mysql.database"
    value = "mlflow"
  }

  set {
    name  = "backendStore.mysql.user"
    value = jsondecode(data.aws_secretsmanager_secret_version.rds_master.secret_string)["username"]
  }

  set {
    name  = "backendStore.mysql.password"
    value = jsondecode(data.aws_secretsmanager_secret_version.rds_master.secret_string)["password"]
  }

  depends_on = [aws_s3_bucket.artifact_storage_s3, data.aws_secretsmanager_secret_version.rds_master]

}

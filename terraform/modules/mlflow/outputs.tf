output "tracking_url" {
  description = "MLFlow tracking URL."
  value       = "http://mlflow-server.mlflow.svc.cluster.local:5000"
}

output "tracking_username" {
  value = "admin"
}

output "tracking_password" {
  value     = random_password.password.result
  sensitive = true
}

output "artifact_bucket_arn" {
  value = aws_s3_bucket.artifact_storage_s3.arn
}

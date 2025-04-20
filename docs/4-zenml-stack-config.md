# 4. ZenML Stack Config

This guide walks you through setting up service connectors for ZenML and registering a complete ZenML stack with:

- ✅ S3 as the Artifact Store
- ✅ ECR as the Container Registry
- ✅ MLflow as the Experiment Tracker and Model Registry
- ✅ Kubernetes (Minikube) as the Orchestrator

> ⚠️ This guide focuses on **local setup using Minikube**, but the steps are nearly identical for EKS with small adjustments (IAM roles, service accounts, etc.).

---

## 🧪 1. Create a Virtual Environment

```bash
uv venv
source .venv/bin/activate
```

---

## 📦 2. Install Required ZenML Integrations

```bash
zenml integration install s3 kubernetes mlflow -y
```

---

## 🚪 3. Port-forward MLflow and ZenML (in separate terminals)

```bash
kubectl port-forward svc/mlflow 5000:5000
```

```bash
kubectl port-forward svc/zenml 8080:8080
```

You can now visit both dashboards:

- [MLFlow](http://localhost:5000)
- [ZenML](http://localhost:8080)

Make a ZenML account via the UI

---

## 🔐 4. Set MLflow and ZenML Credentials

Same username and password set in deployment yaml

```bash
export MLFLOW_TRACKING_USERNAME=admin
export MLFLOW_TRACKING_PASSWORD=password
```

And for ZenML connect export

```bash
export ZENML_STORE_URL=http://localhost:8080
export ZENML_STORE_USERNAME=<username-set-during-setup>
export ZENML_STORE_PASSWORD=<password-set-during-setup>
```

Then Run `zenml status` to see if you can connect to your server.

---

## 🔑 5. Register AWS Service Connector (using implicit auth)

Ensure you're logged into AWS with access to S3 and ECR (via CLI, IAM role, or environment). Then:

```bash
 zenml service-connector register -i --type aws
```

Follow the terminal setup.

Call your service connect `aws-svc-connector`

---

## 📁 6. Register Artifact Store (S3)

```bash
zenml artifact-store register s3_store \
  --flavor=s3 \
  --path=s3://<Bucket-Name>/zenml-artifacts \
  --connector=aws-svc-connector
```

---

## 📦 7. Register Container Registry (ECR)

```bash
zenml container-registry register ecr_registry \
  --flavor=default \
  --uri=<AWS-Account-ID>.dkr.ecr.eu-west-2.amazonaws.com \
  --default_repository=<Name-of-Repo> \
  --connector=aws-svc-connector
```

---

## 🧪 8. Register MLflow Tracker

```bash
zenml experiment-tracker register mlflow_tracker \
  --flavor=mlflow \
  --tracking_uri=http://localhost:5000 \
  --tracking_username=$MLFLOW_TRACKING_USERNAME \
  --tracking_password=$MLFLOW_TRACKING_PASSWORD \
  --connector=aws-svc-connector
```

---

## 📦 9. Register MLflow as Model Registry

```bash
zenml model-registry register mlflow_registry \
  --flavor=mlflow
```

---

## ☸️ 10. Register Kubernetes Orchestrator (Minikube)

```bash
zenml orchestrator register local-k8s \
  --flavor=kubernetes
  --
```

---

## 🧱 11. Register and Activate the Stack

```bash
zenml stack register local-dev \
  --orchestrator=local-k8s \
  --artifact-store=s3_store \
  --container-registry=ecr_registry \
  --experiment-tracker=mlflow_tracker \
  --model-registry=mlflow_registry

zenml stack set local-dev
```


Finally create a ZenML namespace.

```bash
kubectl create namespace zenml
```
---

Your local stack is ready to go! You can now run ZenML pipelines with full MLOps capabilities on your local Minikube cluster.

# Fullstack MLOps GCP

Purpose of this project is to provide a template to setting up an MLOps stack on GCP using mostly open source available tools.

This repo focuses purely on setting up the infrastructure backbone for AI/ML/LLM applications, which you can then tailor to your own business logic and use case.

## Tools

- MLflow - Model Registry
- MLflow - Experiment Tracker
- LakeFS - Data Versioning
- ZenML - Pipeline Orchestrator
- MySQL - RDS backend for MLFlow and ZenML
- BentoML/KServe (Still deciding) - Model Deployment
- Terraform - Infrastructure as Code (IaC)
- Terragrunt - Terraform Configuration Management

# 📚 Documentation Index

The **Fullstack MLOps GCP Setup**!

Please follow the guides in this order:

1. [0 - Prerequisites](docs/0-prerequisites.md)
2. [1 - Infrastructure Setup](docs/1-infrastructure-setup.md)

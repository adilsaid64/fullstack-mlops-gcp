# Fullstack MLOps AWS

Purpose of this project is to provide a template to setting up an MLOps stack on AWS EKS using mostly open source available tools.

This repo focuses purely on setting up the infrastructure backbone for AI/ML/LLM applications, which you can then tailor to your own business logic and use case.

## Tools

- MLflow - Model Registry
- MLflow - Experiment Tracker
- LakeFS - Data Versioning 
- ZenML - Pipeline Orchestrator
- MySQL - RDS backend for MLFlow and ZenML
- S3 - Artifact Storage for ZenML and MLflow
- Terraform and Terragrunt - IaC
- BentoML/KServe (Still deciding) - Model Deployment

# 📚 Documentation Index

The **Fullstack MLOps AWS Setup**!

Please follow the guides in this order:

1. [0 - Prerequisites](docs/0-prerequisites.md)  
2. [1 - Infrastructure Setup](docs/1-infrastructure-setup.md)  
3. [2 - ZenML Stack Setup](docs/2-zenml-setup.md)  

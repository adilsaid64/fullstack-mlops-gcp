.PHONY: deploy restart logs

APP ?= mlflow
ENV ?= dev

set_cluster:
	aws eks update-kubeconfig --region eu-west-2 --name dev-mlops-cluster

deploy_app:
	kubectl apply -k k8s/$(APP)/overlays/$(ENV)

restart:
	kubectl rollout restart deployment/$(APP)

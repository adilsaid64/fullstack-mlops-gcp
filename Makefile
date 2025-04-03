.PHONY: deploy restart logs

APP ?= mlflow
ENV ?= dev

deploy:
	kubectl apply -k k8s/$(APP)/overlays/$(ENV)

restart:
	kubectl rollout restart deployment/$(APP)

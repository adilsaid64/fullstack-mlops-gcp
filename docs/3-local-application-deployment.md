# 3️⃣ Local Application Deployment With Minikube

This guide walks you through deploying services within the k8s folder to a **local Minikube cluster** using `kubectl`

Running your applications on a local Minikube cluster is ideal for development, testing, and experimentation without incurring the cost and overhead of managing a full EKS (Elastic Kubernetes Service) cluster on AWS. It allows you to iterate quickly, debug locally, and simulate your production environment from your PC.

---

## 📁 K8s Structure

Kubernetes manifests are organized using [**Kustomize**](https://kustomize.io/), with a separation between **base configs** and **environment specific overlays**:

```
k8s/
├── Service-App-1/
│   ├── base/               # Generic deployment/services for the application
│   └── overlays/
│       └── dev/            # Environment specific (e.g. dev)
├── Service-App-2/
│   ├── base/
│   └── overlays/
│       └── dev/
```

Each service uses a `kustomization.yaml` to patch configurations by environment.

---

## 🚀 Deployment

### Start Minikube

```bash
minikube start
```

---

### Deploy MLflow

```bash
kubectl apply -k k8s/mlflow/overlays/dev
```

---

### Deploy ZenML

```bash
kubectl apply -k k8s/zenml/overlays/dev
```

---

### Check Deployment Status

```bash
kubectl get pods -A
kubectl get deployments -A
kubectl get svc -A
```

You should see pods, services, and deployments for both MLflow and ZenML running.

---

## Enable Local Registry

This will allow you to push images to a local registry. Useful if you want to mimick something like ECR locally.

```bash
minikube addons enable registry 
```

Then in dev deploy scripts you can push images to: 

```bash
docker tag myapp localhost:80/myapp:latest
docker push localhost:80/myapp:latest
```

after portfowarding

## 🌐 Accessing Services

To access services locally:

### Port Forward (Quick way)

```bash
kubectl port-forward svc/mlflow 5000:5000
kubectl port-forward svc/zenml 8080:8080
kubectl port-forward --n kube-system svc/kubernetes-dashboard 80:80
```

Now you can visit:
- **MLflow UI** → [http://localhost:5000](http://localhost:5000)
- **ZenML UI** → [http://localhost:8080](http://localhost:8080)

# 1️⃣ Infrastructure Setup

This guide walks you through initialising and deploying your AWS infrastructure using **Terraform** + **Terragrunt**.

---

## 🗂 Project Structure

The infrastructure is structured with the standard **modular + environment** layout:

- `modules/`: Reusable Terraform modules (VPC, EKS, Node Group)
- `live/`: Environment-specific configurations (e.g., dev, prod)
- `live/dev/`: Contains Terragrunt configurations for each component  
  *(VPC → EKS → Node Group dependencies are already setup up)*

---

## 🧱 Stack Components (Dev)

| Component     | Path                        | Description                          |
|--------------|-----------------------------|--------------------------------------|
| VPC          | `live/dev/vpc`              | Sets up the Virtual Private Cloud    |
| EKS Cluster  | `live/dev/eks`              | Deploys the EKS control plane        |
| Node Group   | `live/dev/node_group`       | Adds worker nodes to the EKS cluster |

---

## ⚙️ Deployment Steps

### 🔐 Step 0: Configure AWS

Ensure your AWS credentials are set:

```bash
aws configure
```

---

### ☁️ Step 1: Set Up Remote State Backend (S3 + DynamoDB)

Before running `terragrunt apply`, you need to create the S3 bucket and DynamoDB table used for storing and locking Terraform state.


Run the following command to create them:

This creates the backend s3 table.
```bash
aws s3api create-bucket --bucket terraform-state-full-stack-mlops --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 
```

This creates the backend dynamodb table.
```bash
aws dynamodb create-table --table-name terraform-lock --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region eu-west-2
```

### 🔧 Step 2: Disable EKS Cluster Add-ons Temporarily

Before your first deployment, you should **comment out the EKS add-ons block** in the EKS module to avoid dependency issues. These add-ons require the EKS control plane to be fully available before they can be created.

Locate the following block in  [EKS Module ](../terraform/modules/eks/main.tf) (around lines 29–33) and **comment it out**.


### 🚀 Step 3: Deploy Stack

Navigate to the **dev** environment folder:

```bash
cd terraform/live/dev
terragrunt run-all apply
```

Terragrunt will:

✅ Automatically initialize all components  
✅ Respect dependency order (VPC → EKS → Node Group)  
✅ Use remote state from `root.hcl`  

This can take around 20-30 minutes to complete.

Once done you can bring the EKS add-ons back in 
[EKS Module ](../terraform/modules/eks/main.tf) lines 29-33 and run: 

```bash
terragrunt run-all apply
```

This shouldn't take that long.

---

### 📡 Step 4: Connect `kubectl` to EKS

After the cluster and node group are up:

```bash
aws eks --region eu-west-2 update-kubeconfig --name dev-mlops-cluster
kubectl get nodes
```

---

## ✅ Success Check

- `kubectl get nodes` → You should see EKS worker nodes  
- AWS Console → Check EKS, VPC, Subnets  
- Terraform state is in your configured S3 backend


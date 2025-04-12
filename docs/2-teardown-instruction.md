# 3️⃣ Teardown Instructions (Destroy All Infra)

If you want to completely remove all infrastructure and clean up resources, follow these steps:

### ❗️Warning

> This will **permanently delete** all infrastructure in the selected environment (VPC, EKS Cluster, Node Group, etc.).  
> Make sure you've backed up any necessary data or configurations.

---

### 🔥 Step 1: Navigate to Environment Directory

From the root of your Terraform repo, go to the target environment:

```bash
cd terraform/live/dev
```

---

### 🧨 Step 2: Run Destroy Command

Run the following command to destroy all resources in the correct dependency order:

```bash
terragrunt run-all destroy
```

This will:

✅ Destroy Node Group  
✅ Destroy EKS Cluster  
✅ Destroy VPC  

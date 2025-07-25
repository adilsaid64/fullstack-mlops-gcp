import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as fs from "fs";
import * as os from "os";

const __pulumiType = "custom:k8s:CustomCluster";

export interface CustomClusterArgs {
    kubeconfig: pulumi.Input<string>;
}

export class CustomCluster extends pulumi.ComponentResource {
    public readonly kubeconfig: pulumi.Input<string>;
    public readonly provider: k8s.Provider;

    constructor(name: string, args: CustomClusterArgs, opts?: pulumi.ComponentResourceOptions) {
        super(__pulumiType, name, args, opts);

        this.kubeconfig = args.kubeconfig;

        this.provider = new k8s.Provider(`${name}-provider`, {
            kubeconfig: this.kubeconfig,
        }, { parent: this });

        this.registerOutputs({
            kubeconfig: this.kubeconfig,
            provider: this.provider,
        });
    }

    static get(name: string, opts?: pulumi.ComponentResourceOptions): CustomCluster {
        const stack = pulumi.getStack();

        if (stack === "local") {
            const kubeconfigPath = `${os.homedir()}/.kube/config`;
            const kubeconfig = fs.readFileSync(kubeconfigPath, "utf8");

            return new CustomCluster(name, { kubeconfig }, opts);
        }

        throw new Error(`[CustomCluster.get] Unsupported stack: ${stack}`);
    }

    public createNamespace(
        name: string,
        args: k8s.core.v1.NamespaceArgs,
        opts?: pulumi.ResourceOptions
    ): k8s.core.v1.Namespace {
        return new k8s.core.v1.Namespace(name, args, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public deployHelmChart(
        name: string,
        args: k8s.helm.v4.ChartArgs,
        opts?: pulumi.ResourceOptions
    ): k8s.helm.v4.Chart {
        return new k8s.helm.v4.Chart(name, args, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public deployManifest(
        name: string,
        deploymentArgs: k8s.apps.v1.DeploymentArgs,
        serviceArgs: k8s.core.v1.ServiceArgs,
        opts?: pulumi.ResourceOptions
    ) {
        const deployment = new k8s.apps.v1.Deployment(name, deploymentArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });

        const service = new k8s.core.v1.Service(name, serviceArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });

        return { deployment, service };
    }

    public deployIngress(
        name: string,
        args: k8s.networking.v1.IngressArgs,
        opts?: pulumi.ResourceOptions
    ): k8s.networking.v1.Ingress {
        return new k8s.networking.v1.Ingress(name, args, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public createServiceAccount(
        name: string,
        args: k8s.core.v1.ServiceAccountArgs,
        opts?: pulumi.ResourceOptions
    ): k8s.core.v1.ServiceAccount {
        return new k8s.core.v1.ServiceAccount(name, args, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public bindClusterRole(
        name: string,
        args: k8s.rbac.v1.ClusterRoleBindingArgs,
        opts?: pulumi.ResourceOptions
    ): k8s.rbac.v1.ClusterRoleBinding {
        return new k8s.rbac.v1.ClusterRoleBinding(name, args, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public createSecret(
        name: string,
        args: k8s.core.v1.SecretArgs,
        opts?: pulumi.ResourceOptions
    ): k8s.core.v1.Secret {
        return new k8s.core.v1.Secret(name, args, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public createStorageClass(
        name: string,
        args: k8s.storage.v1.StorageClassArgs,
        opts?: pulumi.ResourceOptions
    ): k8s.storage.v1.StorageClass {
        return new k8s.storage.v1.StorageClass(name, args, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }
}

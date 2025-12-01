import {
    ComponentResource,
    getStack,
    type ComponentResourceOptions,
    type Input,
    type ResourceOptions,
} from '@pulumi/pulumi';
import * as kubernetes from "@pulumi/kubernetes";
import * as fs from "fs";
import * as os from "os";
import { isLocal } from '../../utils/utils';

export interface CustomClusterArgs {
    tags?: Record<string, string>;
}

export interface GetCustomClusterArgs {
    region: string;
    clusterId: string;
}

export interface CreateNamespaceArgs {
    namespaceArgs: kubernetes.core.v1.NamespaceArgs;
}

export interface DeployApplicationViaHelmChartArgs {
    releaseArgs: kubernetes.helm.v3.ReleaseArgs;
}

export interface DeployApplicationViaManifestArgs {
    deploymentArgs: kubernetes.apps.v1.DeploymentArgs;
    serviceArgs: kubernetes.core.v1.ServiceArgs;
}

export interface DeployStatefulApplicationArgs {
    deploymentArgs: kubernetes.apps.v1.StatefulSetArgs;
    serviceArgs: kubernetes.core.v1.ServiceArgs;
    discoveryServiceArgs: kubernetes.core.v1.ServiceArgs;
}

export interface DeployIngressArgs {
    ingressArgs: kubernetes.networking.v1.IngressArgs;
}

export interface CreateServiceAccountArgs {
    serviceAccountArgs: kubernetes.core.v1.ServiceAccountArgs;
}

export interface BindClusterRoleToServiceAccountArgs {
    clusterRoleBindingArgs: kubernetes.rbac.v1.ClusterRoleBindingArgs;
}

export interface CreateSecretArgs {
    secretArgs: kubernetes.core.v1.SecretArgs;
}

export interface CreateStorageClassArgs {
    storageClassArgs: kubernetes.storage.v1.StorageClassArgs;
}

export interface CreateIngressClassArgs {
    ingressClassArgs: kubernetes.networking.v1.IngressClassArgs;
}

export interface CreateCustomResourceArgs {
    customResourceArgs: kubernetes.apiextensions.CustomResourceArgs;
}

const __pulumiType = 'myproject:infra:CustomCluster';

export class CustomCluster extends ComponentResource {
    public provider: kubernetes.Provider;
    public kubeconfig: Input<string>;
    public clusterName: Input<string>;

    constructor(name: string, args?: CustomClusterArgs, opts?: ComponentResourceOptions) {
        super(__pulumiType, name, args, opts);

        // Provision a EKS cluster from your fav cloud provider
        this.kubeconfig = undefined!;
        this.provider = undefined!;
        this.clusterName = undefined!;

        this.registerOutputs({
            kubeconfig: this.kubeconfig,
            provider: this.provider,
            clusterName: this.clusterName,
        });
    }

    static get(name: string, args?: GetCustomClusterArgs, opts?: ComponentResourceOptions): CustomCluster {
        const stack = getStack();

        const instance = new CustomCluster(name, undefined, opts);

        if (isLocal()) {
            // if local stack then use locala minikube clusters
            const kubeconfigPath = `${os.homedir()}/.kube/config`;
            const kubeconfig = fs.readFileSync(kubeconfigPath, "utf8");
            instance.kubeconfig = kubeconfig
            instance.provider = new kubernetes.Provider(
                `${name}-local-provider`,
                {
                    kubeconfig: kubeconfig,
                    context: 'minikube',
                },
                { parent: instance },
            );

            return instance;
        } else {
            throw new Error(`[CustomCluster.get] Unsupported stack: ${stack}`);
        }
    }

    public createNamespace(
        name: string,
        args: CreateNamespaceArgs,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ): kubernetes.core.v1.Namespace {
        return new kubernetes.core.v1.Namespace(name, args.namespaceArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public deployApplicationViaHelmChart(
        name: string,
        args: DeployApplicationViaHelmChartArgs,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ): kubernetes.helm.v3.Release {
        return new kubernetes.helm.v3.Release(name, args.releaseArgs, { provider: this.provider, parent: this, ...opts });
    }

    public deployApplicationViaManifest(
        name: string,
        args: DeployApplicationViaManifestArgs,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ) {
        const deployment = new kubernetes.apps.v1.Deployment(name, args.deploymentArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });

        const service = new kubernetes.core.v1.Service(name, args.serviceArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });

        return { deployment: deployment, service: service };
    }

    public deployStatefulApplication(
        name: string,
        args: DeployStatefulApplicationArgs,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ) {
        const deployment = new kubernetes.apps.v1.StatefulSet(name, args.deploymentArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });

        const service = new kubernetes.core.v1.Service(`${name}-core`, args.serviceArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });

        const discoveryService = new kubernetes.core.v1.Service(`${name}-dscvr`, args.discoveryServiceArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
        return { deployment: deployment, service: service, discoveryService: discoveryService };
    }

    public deployIngress(name: string, args: DeployIngressArgs, opts?: Omit<ResourceOptions, 'provider' | 'parent'>) {
        return new kubernetes.networking.v1.Ingress(name, args.ingressArgs, {
            provider: this.provider,
            parent: this,
            deleteBeforeReplace: true,
            ...opts,
        });
    }

    public createServiceAccount(
        name: string,
        args: CreateServiceAccountArgs,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ) {
        return new kubernetes.core.v1.ServiceAccount(name, args.serviceAccountArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public bindClusterRoleToServiceAccount(
        name: string,
        args: BindClusterRoleToServiceAccountArgs,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ) {
        return new kubernetes.rbac.v1.ClusterRoleBinding(name, args.clusterRoleBindingArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public createK8sSecret(name: string, args: CreateSecretArgs, opts?: Omit<ResourceOptions, 'provider' | 'parent'>) {
        return new kubernetes.core.v1.Secret(name, args.secretArgs, { provider: this.provider, parent: this, ...opts });
    }

    public createStorageClass(
        name: string,
        args: CreateStorageClassArgs,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ) {
        return new kubernetes.storage.v1.StorageClass(name, args.storageClassArgs, {
            parent: this,
            provider: this.provider,
            ...opts,
        });
    }

    public createIngressClass(
        name: string,
        args: CreateIngressClassArgs,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ) {
        return new kubernetes.networking.v1.IngressClass(name, args.ingressClassArgs, {
            parent: this,
            provider: this.provider,
            ...opts,
        });
    }

    public createCustomResource(
        name: string,
        args: CreateCustomResourceArgs,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ) {
        return new kubernetes.apiextensions.CustomResource(name, args.customResourceArgs, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public getNamespace(
        name: string,
        id: string,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ): kubernetes.core.v1.Namespace {
        return kubernetes.core.v1.Namespace.get(name, id, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public getServiceAccount(
        name: string,
        id: string,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ): kubernetes.core.v1.ServiceAccount {
        return kubernetes.core.v1.ServiceAccount.get(name, id, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public getService(
        name: string,
        id: Input<string>,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ): kubernetes.core.v1.Service {
        return kubernetes.core.v1.Service.get(name, id, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

    public getSecret(
        name: string,
        id: Input<string>,
        opts?: Omit<ResourceOptions, 'provider' | 'parent'>,
    ): kubernetes.core.v1.Secret {
        return kubernetes.core.v1.Secret.get(name, id, {
            provider: this.provider,
            parent: this,
            ...opts,
        });
    }

}
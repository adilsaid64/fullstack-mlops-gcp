import * as k8s from "@pulumi/kubernetes";
import * as helm from "@pulumi/kubernetes/helm/v4";

interface DeployMinioArgs {
    name: string;
    provider: k8s.Provider;
    rootUser: string;
    rootPassword: string;
    defaultBuckets: string;
}

export function deployMinio(args: DeployMinioArgs) {
    const chartValues = {
        fullnameOverride: args.name,
        auth: {
            rootUser: args.rootUser,
            rootPassword: args.rootPassword,
            usePasswordFiles: false,
        },
        defaultBuckets: args.defaultBuckets,
        mode: "standalone",
        persistence: {
            enabled: true,
            size: "10Gi",
        },
        resourcesPreset: "micro",
        console: {
            enabled: true,
        },
        service: {
            type: "ClusterIP",
        },
    };

    const chart = new helm.Chart(args.name, {
        chart: "minio",
        version: "17.0.15",
        repositoryOpts: {
            repo: "https://charts.bitnami.com/bitnami",
        },
        values: chartValues,
    }, {
        provider: args.provider,
    });

    return { chart };
}

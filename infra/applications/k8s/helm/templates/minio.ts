
import * as k8s from "@pulumi/kubernetes";

export interface MinioHelmChartArgs {
    name: string;
    rootUser: string;
    rootPassword: string;
    defaultBuckets: string; // comma-separated: e.g., "mlflow,zenml"
}

export class MinioHelmChart {
    constructor(private args: MinioHelmChartArgs) { }

    getHelmConfig(): k8s.helm.v4.ChartArgs {
        return {
            chart: "minio",
            version: "17.0.15",
            repositoryOpts: {
                repo: "https://charts.bitnami.com/bitnami",
            },
            values: {
                auth: {
                    rootUser: this.args.rootUser,
                    rootPassword: this.args.rootPassword,
                    usePasswordFiles: false,
                },
                defaultBuckets: this.args.defaultBuckets,
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
            },
        };
    }
}

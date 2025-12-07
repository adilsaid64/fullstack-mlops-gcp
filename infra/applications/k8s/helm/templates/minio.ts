import * as k8s from "@pulumi/kubernetes";

export interface MinioHelmChartArgs {
    name: string;
    namespace: string;
    rootUser: string;
    rootPassword: string;
}

export class MinioHelmChart {
    constructor(private args: MinioHelmChartArgs) { }

    getHelmConfig(): k8s.helm.v3.ReleaseArgs {
        return {
            name: this.args.name,
            namespace: this.args.namespace,
            chart: "minio",
            version: "5.0.33",
            repositoryOpts: { repo: "https://charts.min.io/" },
            values: {
                mode: "standalone",
                rootUser: this.args.rootUser,
                rootPassword: this.args.rootPassword,
                service: {
                    type: "ClusterIP",
                }
            }
        };
    }
}

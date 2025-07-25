import * as k8s from "@pulumi/kubernetes";
import * as helm from "@pulumi/kubernetes/helm/v4";
import * as pulumi from "@pulumi/pulumi";

export interface MLflowHelmChartArgs {
    auth: {
        adminUsername: string;
        adminPassword: string;
    };
    db: {
        host: pulumi.Input<string>;
        port: number;
        user: string;
        password: string;
        database: string;
    };
    artifactBackend: "minio" | "gcs";
    minio?: {
        host: string;
        port: number;
        accessKey: string;
        secretKey: string;
        bucket: string;
    };
    gcs?: {
        bucket: string;
        googleCloudProject?: string;
        existingSecret?: string;
        existingSecretKey?: string;
    };
}

export class MlflowHelmChart {
    constructor(private args: MLflowHelmChartArgs) { }

    getHelmConfig(): k8s.helm.v4.ChartArgs {
        const values: any = {
            flaskServerSecretKey: this.args.auth.adminPassword,
            backendStore: {
                mysql: {
                    enabled: true,
                    driver: "pymysql",
                    host: this.args.db.host,
                    port: this.args.db.port,
                    user: this.args.db.user,
                    password: this.args.db.password,
                    database: this.args.db.database,
                },
            },
            service: {
                port: 5000,
                type: "ClusterIP",
            },
            auth: {
                enabled: true,
                adminUsername: this.args.auth.adminUsername,
                adminPassword: this.args.auth.adminPassword,
            },
        };

        if (this.args.artifactBackend === "minio" && this.args.minio) {
            values.artifactRoot = {
                s3: {
                    enabled: true,
                    bucket: this.args.minio.bucket,
                    awsAccessKeyId: this.args.minio.accessKey,
                    awsSecretAccessKey: this.args.minio.secretKey,
                },
            };
            values.extraEnvVars = {
                MLFLOW_S3_ENDPOINT_URL: `http://${this.args.minio.host}:${this.args.minio.port}`,
            };
        }

        if (this.args.artifactBackend === "gcs" && this.args.gcs) {
            values.artifactRoot = {
                gcs: {
                    enabled: true,
                    bucket: this.args.gcs.bucket,
                },
            };
        }

        return {
            chart: "mlflow",
            version: "0.18.0",
            repositoryOpts: {
                repo: "https://community-charts.github.io/helm-charts",
            },
            values,
        };
    }
}

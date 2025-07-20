import * as k8s from "@pulumi/kubernetes";
import * as helm from "@pulumi/kubernetes/helm/v4";
import * as pulumi from "@pulumi/pulumi";

interface DeployMLflowArgs {
    name: string;
    provider: k8s.Provider;
    auth: {
        adminUsername: string,
        adminPassword: string,
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
        host: pulumi.Input<string>;
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
    dependsOn?: pulumi.Input<pulumi.Resource>[];
}

export function deployMLflow(args: DeployMLflowArgs) {
    const chartValues: any = {
        flaskServerSecretKey: args.auth.adminPassword,
        backendStore: {
            databaseMigration: true,
            databaseConnectionCheck: true,
            mysql: {
                enabled: true,
                driver: "pymysql",
                host: args.db.host,
                port: args.db.port,
                user: args.db.user,
                password: args.db.password,
                database: args.db.database,
            }
        },
        artifactRoot: {},
        service: {
            port: 5000,
            type: "ClusterIP"
        },
        auth: {
            enabled: true,
            adminUsername: args.auth.adminUsername,
            adminPassword: args.auth.adminPassword
        }
    };

    if (args.artifactBackend === "minio" && args.minio) {
        chartValues.artifactRoot = {
            s3: {
                enabled: true,
                bucket: args.minio.bucket,
                awsAccessKeyId: args.minio.accessKey,
                awsSecretAccessKey: args.minio.secretKey,
                path: "",
            }
        };
        chartValues.extraEnvVars = {
            MLFLOW_S3_ENDPOINT_URL: `http://${args.minio.host}:${args.minio.port}`
        };
    }

    if (args.artifactBackend === "gcs" && args.gcs) {
        chartValues.artifactRoot = {
            gcs: {
                enabled: true,
                bucket: args.gcs.bucket,
                path: ""
            }
        };
    }

    const chart = new helm.Chart(args.name, {
        chart: "mlflow",
        version: "0.18.0",
        repositoryOpts: {
            repo: "https://community-charts.github.io/helm-charts",
        },
        values: chartValues,
    }, { provider: args.provider, dependsOn: [...(args.dependsOn ?? [])] });

    return { chart };
}

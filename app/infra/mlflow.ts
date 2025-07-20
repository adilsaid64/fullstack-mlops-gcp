import * as k8s from "@pulumi/kubernetes";
import * as helm from "@pulumi/kubernetes/helm/v3";

interface DeployMLflowArgs {
    provider: k8s.Provider;
    db: {
        host: string;
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

export function deployMLflow(args: DeployMLflowArgs) {
    const chartValues: any = {
        postgresql: { enabled: false },
        externalDatabase: {
            dialectDriver: "postgresql",
            host: args.db.host,
            port: args.db.port,
            user: args.db.user,
            password: args.db.password,
            database: args.db.database,
        },
        tracking: {
            enabled: true,
            service: {
                type: "ClusterIP",
                ports: { http: 5000 },
            },
        },
    };

    if (args.artifactBackend === "minio" && args.minio) {
        chartValues.externalS3 = {
            host: args.minio.host,
            port: args.minio.port,
            accessKeyID: args.minio.accessKey,
            accessKeySecret: args.minio.secretKey,
            bucket: args.minio.bucket,
            protocol: "http",
            serveArtifacts: true,
            useCredentialsInSecret: false,
        };
    }

    if (args.artifactBackend === "gcs" && args.gcs) {
        chartValues.externalGCS = {
            bucket: args.gcs.bucket,
            googleCloudProject: args.gcs.googleCloudProject || "",
            serveArtifacts: true,
            useCredentialsInSecret: true,
            existingSecret: args.gcs.existingSecret,
            existingSecretKey: args.gcs.existingSecretKey,
        };
    }

    return new helm.Chart("mlflow", {
        chart: "mlflow",
        version: "5.1.4",
        fetchOpts: {
            repo: "https://charts.bitnami.com/bitnami",
        },
        values: chartValues,
    }, { provider: args.provider });
}

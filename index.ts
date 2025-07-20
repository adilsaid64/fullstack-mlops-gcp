import * as pulumi from "@pulumi/pulumi";
import { getK8sProvider } from "./infra/getK8sProvider";
import { deployMinio } from "./infra/local/minio";
import { deployMySql } from "./infra/local/mysql";
import { deployMLflow } from "./infra/mlflow";
import { deployPhpMyAdmin } from "./infra/phpMyAdmin";

// NOTE: not advised todo this, its just to make dev a little easier
// ideally this should be generated and stored safely, just a temp solution while building project
const defaultUsername = "admin123"
const defaultPassword = "password123"

// fetch k8s provider dynamiclly based on stack, if stack is local, it fetches local minikube k8s provider
// this allows you to test deploy applications to minikube
const k8sProvider = getK8sProvider()

// deploying a local mysql and object store for local dev, prod will use gcp, this will be controled by pulumi.getStack()
const mySqlDeployment = deployMySql({
    name: `mysql-${pulumi.getStack()}`,
    provider: k8sProvider,
    rootPassword: defaultPassword,
    user: defaultUsername,
    userPassword: defaultPassword,
    database: "mydb"
})

const minioDeployment = deployMinio({
    name: `minio-${pulumi.getStack()}`,
    provider: k8sProvider,
    rootUser: defaultUsername,
    rootPassword: defaultPassword,
    defaultBuckets: "mlflow,zenml",
});

export const dbHost = `mysql-${pulumi.getStack()}.default.svc.cluster.local`;
export const minioHost = `minio-${pulumi.getStack()}.default.svc.cluster.local`;

const mlflowDeployment = deployMLflow({
    name: `mlflow-${pulumi.getStack()}`,
    provider: k8sProvider,
    artifactBackend: "minio",
    auth: {
        adminUsername: defaultUsername,
        adminPassword: defaultPassword,
    },
    db: {
        host: dbHost,
        port: 3306,
        user: defaultUsername,
        password: defaultPassword,
        database: "mydb"
    },
    minio: {
        accessKey: defaultUsername,
        secretKey: defaultPassword,
        host: minioHost,
        port: 9000,
        bucket: "mlflow"
    },
    dependsOn: [mySqlDeployment.chart, minioDeployment.chart]
});

const phpMyAdmin = deployPhpMyAdmin({
    name: `phpmyadmin-${pulumi.getStack()}`,
    provider: k8sProvider,
    mysqlHost: dbHost,
    mysqlPort: 3306,
    mysqlUser: defaultUsername,
    mysqlPassword: defaultPassword,
    dependsOn: [mySqlDeployment.chart]
});
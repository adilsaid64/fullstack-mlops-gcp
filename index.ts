import * as pulumi from "@pulumi/pulumi";
import { k8sProvider } from "./infra/getK8sProvider";
import { deployMinio } from "./infra/local/minio";
import { deployMySql } from "./infra/local/mysql";
import { deployMLflow } from "./infra/mlflow";
import { deployPhpMyAdmin } from "./infra/phpMyAdmin";


// datastores
const mySqlDeployment = deployMySql({
    name: `mysql-${pulumi.getStack()}`,
    provider: k8sProvider,
    rootPassword: "password",
    user: "admin",
    userPassword: "password",
    database: "mydb"
})

const minioDeployment = deployMinio({
    name: `minio-${pulumi.getStack()}`,
    provider: k8sProvider,
    rootUser: "admin",
    rootPassword: "password",
    defaultBuckets: "mlflow,zenml",
});

export const dbHost = `mysql-${pulumi.getStack()}.default.svc.cluster.local`;
export const minioHost = `minio-${pulumi.getStack()}.default.svc.cluster.local`;

const mlflowDeployment = deployMLflow({
    name: `mlflow-${pulumi.getStack()}`,
    provider: k8sProvider,
    artifactBackend: "minio",
    auth: {
        adminUsername: "admin",
        adminPassword: "password",
    },
    db: {
        host: dbHost,
        port: 3306,
        user: "admin",
        password: "password",
        database: "mydb"
    },
    minio: {
        accessKey: "admin",
        secretKey: "password",
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
    mysqlUser: "admin",
    mysqlPassword: "password",
    dependsOn: [mySqlDeployment.chart]
});
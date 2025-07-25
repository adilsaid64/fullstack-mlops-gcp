import * as pulumi from "@pulumi/pulumi";

import { MinioHelmChart, MinioHelmChartArgs } from "./infra/applications/k8s/helm/minio";
import { MySqlHelmChart, MySqlHelmChartArgs } from "./infra/applications/k8s/helm/mysql";
import { MlflowHelmChart, MLflowHelmChartArgs } from "./infra/applications/k8s/helm/mlflow";
import { PhpMyAdminHelmChart, PhpMyAdminHelmChartArgs } from "./infra/applications/k8s/helm/phpMyAdmin";

import { CustomCluster } from "./infra/components/CustomCluster/CustomCluster";

const defaultUsername = "admin123"
const defaultPassword = "password123"

const customCluster = CustomCluster.get('custom-cluster')

const mysqlArgs: MySqlHelmChartArgs = {
    name: `mysql-${pulumi.getStack()}`,
    rootPassword: defaultPassword,
    user: defaultUsername,
    userPassword: defaultPassword,
    database: "mydb",
};
const mysqlConfig = new MySqlHelmChart(mysqlArgs);
customCluster.deployHelmChart("mysql", mysqlConfig.getHelmConfig());

const minioArgs: MinioHelmChartArgs = {
    name: `minio-${pulumi.getStack()}`,
    rootUser: defaultUsername,
    rootPassword: defaultPassword,
    defaultBuckets: "mlflow,zenml",
};
const minioConfig = new MinioHelmChart(minioArgs);
customCluster.deployHelmChart("minio", minioConfig.getHelmConfig());

export const dbHost = `mysql-${pulumi.getStack()}.default.svc.cluster.local`;
export const minioHost = `minio-${pulumi.getStack()}.default.svc.cluster.local`;

const phpMyAdminArgs: PhpMyAdminHelmChartArgs = {
    mysqlHost: dbHost,
    mysqlPort: 3306,
    mysqlUser: defaultUsername,
    mysqlPassword: defaultPassword,
};
const phpMyAdminConfig = new PhpMyAdminHelmChart(phpMyAdminArgs);
customCluster.deployHelmChart("phpmyadmin", phpMyAdminConfig.getHelmConfig());

const mlflowArgs: MLflowHelmChartArgs = {
    auth: {
        adminUsername: defaultUsername,
        adminPassword: defaultPassword,
    },
    db: {
        host: dbHost,
        port: 3306,
        user: defaultUsername,
        password: defaultPassword,
        database: "mydb",
    },
    artifactBackend: "minio",
    minio: {
        host: minioHost,
        port: 9000,
        accessKey: defaultUsername,
        secretKey: defaultPassword,
        bucket: "mlflow",
    },
};

const mlflowConfig = new MlflowHelmChart(mlflowArgs);
customCluster.deployHelmChart("mlflow", mlflowConfig.getHelmConfig());

import * as pulumi from "@pulumi/pulumi";
export * from './infra/global'
// import { MinioHelmChart, MinioHelmChartArgs } from "./infra/applications/k8s/helm/templates/minio";
// import { PostgresHelmChartArgs, PostgresHelmChart } from "./infra/applications/k8s/helm/templates/postgres";
// import { MlflowHelmChart, MLflowHelmChartArgs } from "./infra/applications/k8s/helm/templates/mlflow";
// import { PhpMyAdminHelmChart, PhpMyAdminHelmChartArgs } from "./infra/applications/k8s/helm/templates/phpMyAdmin";
// import { PrometheusGrafanaChart, PrometheusGrafanaChartConfig } from "./infra/applications/k8s/helm/templates/promethuesGrafana";
// import { PrefectHelmChart, PrefectHelmChartArgs } from "./infra/applications/k8s/helm/templates/prefect";
// import { CustomCluster } from "./infra/components/CustomCluster/CustomCluster";

// const defaultUsername = "admin123"
// const defaultPassword = "password123"

// const customCluster = CustomCluster.get('custom-cluster')

// const postgresArgs: PostgresHelmChartArgs = {
//     name: `postgres-${pulumi.getStack()}`,
//     postgresPassword: defaultPassword,
//     postgresUser: defaultUsername,
//     postgresDatabase: "mydb",
// };
// const postgresConfig = new PostgresHelmChart(postgresArgs);
// customCluster.deployHelmChart("postgres", postgresConfig.getHelmConfig());

// const minioArgs: MinioHelmChartArgs = {
//     name: `minio-${pulumi.getStack()}`,
//     rootUser: defaultUsername,
//     rootPassword: defaultPassword,
//     defaultBuckets: "mlflow,zenml",
// };
// const minioConfig = new MinioHelmChart(minioArgs);
// customCluster.deployHelmChart("minio", minioConfig.getHelmConfig());

// export const dbHost = `mysql-${pulumi.getStack()}.default.svc.cluster.local`;
// export const minioHost = `minio-${pulumi.getStack()}.default.svc.cluster.local`;

// const phpMyAdminArgs: PhpMyAdminHelmChartArgs = {
//     mysqlHost: dbHost,
//     mysqlPort: 3306,
//     mysqlUser: defaultUsername,
//     mysqlPassword: defaultPassword,
// };
// const phpMyAdminConfig = new PhpMyAdminHelmChart(phpMyAdminArgs);
// customCluster.deployHelmChart("phpmyadmin", phpMyAdminConfig.getHelmConfig());

// const mlflowArgs: MLflowHelmChartArgs = {
//     auth: {
//         adminUsername: defaultUsername,
//         adminPassword: defaultPassword,
//     },
//     db: {
//         host: dbHost,
//         port: 3306,
//         user: defaultUsername,
//         password: defaultPassword,
//         database: "mydb",
//     },
//     artifactBackend: "minio",
//     minio: {
//         host: minioHost,
//         port: 9000,
//         accessKey: defaultUsername,
//         secretKey: defaultPassword,
//         bucket: "mlflow",
//     },
//     versionTag: '2.22.1'
// };

// const mlflowConfig = new MlflowHelmChart(mlflowArgs);
// customCluster.deployHelmChart("mlflow", mlflowConfig.getHelmConfig());


// const prometheusGrafanaChartConfig = new PrometheusGrafanaChart({
//     version: "75.13.0",
//     grafanaPassword: "admin",
// });
// customCluster.deployHelmChart("monitoring", prometheusGrafanaChartConfig.getHelmConfig());


// researching what orchestrator/pipeline tracker, and model server to use
// between metaflow, kubeflow, bentoml, seldonai, kserve(ill go with this if i use kubeflow)


// const prefectChart = new PrefectHelmChart({
//     name: "prefect-server",
//     adminPassword: "supersecurepassword",
//     enableBasicAuth: false,
//     useBundledPostgres: true,
//     // postgres: {
//     //     username: defaultUsername,
//     //     password: defaultPassword,
//     //     host: "my-postgres-host",
//     //     port: 5432,
//     //     database: "prefectdb",
//     // },
//     version: "2025.7.22192212",
// });

// customCluster.deployHelmChart('prefect-server', prefectChart.getHelmConfig());

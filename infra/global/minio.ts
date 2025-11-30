import * as pulumi from "@pulumi/pulumi";
import { MinioHelmChartArgs, MinioHelmChart } from "../applications/k8s/helm/templates/minio";
import { defaultPassword, defaultUsername } from "./secrets";
import { customCluster } from "./cluster";

const minioArgs: MinioHelmChartArgs = {
    name: `minio-${pulumi.getStack()}`,
    rootUser: defaultUsername,
    rootPassword: defaultPassword,
    defaultBuckets: "mlflow,zenml",
};
const minioConfig = new MinioHelmChart(minioArgs);
customCluster.deployHelmChart("minio", minioConfig.getHelmConfig());

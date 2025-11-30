import * as pulumi from "@pulumi/pulumi";
import { PostgresHelmChartArgs, PostgresHelmChart } from "../applications/k8s/helm/templates/postgres";
import { defaultPassword, defaultUsername } from "./secrets";
import { customCluster } from "./cluster";

const postgresArgs: PostgresHelmChartArgs = {
    name: `postgres-${pulumi.getStack()}`,
    postgresPassword: defaultPassword,
    postgresUser: defaultUsername,
    postgresDatabase: "mydb",
};

const postgresConfig = new PostgresHelmChart(postgresArgs);

customCluster.deployHelmChart("postgres", postgresConfig.getHelmConfig());

export const dbHost = `mysql-${pulumi.getStack()}.default.svc.cluster.local`;

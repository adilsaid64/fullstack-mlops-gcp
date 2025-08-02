import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export interface PostgresHelmChartArgs {
    name: string;
    postgresPassword: string;
    postgresUser: string;
    postgresDatabase: string;
}

export class PostgresHelmChart {
    constructor(private args: PostgresHelmChartArgs) { }

    getHelmConfig(): k8s.helm.v4.ChartArgs {
        return {
            chart: "postgresql",
            version: "12.5.7",
            repositoryOpts: {
                repo: "https://charts.bitnami.com/bitnami",
            },
            values: {
                auth: {
                    postgresPassword: this.args.postgresPassword,
                    username: this.args.postgresUser,
                    database: this.args.postgresDatabase,
                },
                primary: {
                    service: {
                        ports: {
                            postgresql: 5432,
                        },
                    },
                    persistence: {
                        enabled: true,
                        size: "8Gi",
                    },
                },
            },
        };
    }
}

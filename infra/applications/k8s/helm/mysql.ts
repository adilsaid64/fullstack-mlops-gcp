import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export interface MySqlHelmChartArgs {
    name: string;
    rootPassword: string;
    user: string;
    userPassword: string;
    database: string;
}

export class MySqlHelmChart {
    constructor(private args: MySqlHelmChartArgs) { }

    getHelmConfig(): k8s.helm.v4.ChartArgs {
        return {
            chart: "mysql",
            version: "13.0.4",
            repositoryOpts: {
                repo: "https://charts.bitnami.com/bitnami",
            },
            values: {
                auth: {
                    rootPassword: this.args.rootPassword,
                    username: this.args.user,
                    password: this.args.userPassword,
                    database: this.args.database,
                },
                primary: {
                    service: {
                        ports: {
                            mysql: 3306,
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

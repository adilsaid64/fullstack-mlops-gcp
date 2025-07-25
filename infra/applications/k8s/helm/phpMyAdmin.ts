import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export interface PhpMyAdminHelmChartArgs {
    mysqlHost: pulumi.Input<string>;
    mysqlPort: number;
    mysqlUser: string;
    mysqlPassword: string;
}

export class PhpMyAdminHelmChart {
    constructor(private args: PhpMyAdminHelmChartArgs) { }

    getHelmConfig(): k8s.helm.v4.ChartArgs {
        return {
            chart: "phpmyadmin",
            repositoryOpts: {
                repo: "https://charts.bitnami.com/bitnami",
            },
            values: {
                db: {
                    host: this.args.mysqlHost,
                    port: this.args.mysqlPort,
                    user: this.args.mysqlUser,
                    password: this.args.mysqlPassword,
                },
                service: {
                    type: "ClusterIP",
                    port: 80,
                },
            },
        };
    }
}

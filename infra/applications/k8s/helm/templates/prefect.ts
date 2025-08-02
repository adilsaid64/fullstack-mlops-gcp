import * as k8s from "@pulumi/kubernetes";

export interface PrefectHelmChartArgs {
    name: string;
    adminPassword: string;
    enableBasicAuth?: boolean;
    useBundledPostgres?: boolean;
    postgres?: {
        username: string;
        password: string;
        host: string;
        port: number;
        database: string;
    };
    version?: string;
}

export class PrefectHelmChart {
    constructor(private args: PrefectHelmChartArgs) { }

    getHelmConfig(): k8s.helm.v4.ChartArgs {
        const values: any = {
            server: {
                basicAuth: {
                    enabled: this.args.enableBasicAuth ?? true,
                    authString: `admin:${this.args.adminPassword}`,
                },
            },
            service: {
                type: "ClusterIP",
                port: 4200,
            },
            global: {
                prefect: {
                    image: {
                        repository: "prefecthq/prefect",
                        tag: this.args.version ?? "3.4.10-python3.11",
                    },
                },
            },
        };

        if (this.args.useBundledPostgres) {
            values.postgresql = {
                enabled: true,
                auth: {
                    username: "prefect",
                    password: this.args.postgres?.password ?? "prefect-rocks",
                    database: this.args.postgres?.database ?? "server",
                },
                primary: {
                    persistence: {
                        enabled: false,
                    },
                },
            };
        } else if (this.args.postgres) {
            values.postgresql = {
                enabled: false,
            };
            values.secret = {
                create: true,
                username: this.args.postgres.username,
                password: this.args.postgres.password,
                host: this.args.postgres.host,
                port: this.args.postgres.port.toString(),
                database: this.args.postgres.database,
            };
        }

        return {
            chart: "prefect-server",
            version: "2025.7.22192212", // Or latest as needed
            repositoryOpts: {
                repo: "https://prefecthq.github.io/prefect-helm",
            },
            values,
        };
    }
}

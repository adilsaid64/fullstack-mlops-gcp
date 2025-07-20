import * as k8s from "@pulumi/kubernetes";
import * as helm from "@pulumi/kubernetes/helm/v4";

interface DeployMySqlArgs {
    name: string;
    provider: k8s.Provider;
    rootPassword: string;
    user: string;
    userPassword: string;
    database: string;
}

export function deployMySql(args: DeployMySqlArgs) {
    const chartValues = {
        fullnameOverride: args.name,
        auth: {
            rootPassword: args.rootPassword,
            username: args.user,
            password: args.userPassword,
            database: args.database,
        },
        primary: {
            service: {
                ports: {
                    mysql: 3306
                }
            },
            persistence: {
                enabled: true,
                size: "8Gi"
            }
        }
    };

    const chart = new helm.Chart(args.name, {
        chart: "mysql",
        version: "13.0.4",
        repositoryOpts: {
            repo: "https://charts.bitnami.com/bitnami",
        },
        values: chartValues,
    }, { provider: args.provider });

    return { chart };
}

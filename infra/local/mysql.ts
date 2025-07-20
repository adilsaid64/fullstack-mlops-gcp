import * as k8s from "@pulumi/kubernetes";
import * as helm from "@pulumi/kubernetes/helm/v3";

interface DeployMySqlArgs {
    provider: k8s.Provider;
    rootPassword: string;
    user: string;
    userPassword: string;
    database: string;
}

export function deployMySql(args: DeployMySqlArgs) {
    const chartValues = {
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

    const mySqlHelm = new helm.Chart("mysql", {
        chart: "mysql",
        version: "13.0.4",
        fetchOpts: {
            repo: "https://charts.bitnami.com/bitnami",
        },
        values: chartValues,
    }, { provider: args.provider });

    return mySqlHelm;
}

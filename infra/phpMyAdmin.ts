import * as k8s from "@pulumi/kubernetes";
import * as helm from "@pulumi/kubernetes/helm/v4";
import * as pulumi from "@pulumi/pulumi";

interface DeployPhpMyAdminArgs {
    name: string;
    provider: k8s.Provider;
    mysqlHost: pulumi.Input<string>;
    mysqlPort: number;
    mysqlUser: string;
    mysqlPassword: string;
}

export function deployPhpMyAdmin(args: DeployPhpMyAdminArgs) {
    const chart = new helm.Chart(args.name, {
        chart: "phpmyadmin",
        version: "12.1.3",
        repositoryOpts: {
            repo: "https://charts.bitnami.com/bitnami",
        },
        values: {
            db: {
                host: args.mysqlHost,
                port: args.mysqlPort,
                user: args.mysqlUser,
                password: args.mysqlPassword,
            },
            service: {
                type: "ClusterIP",
                port: 80,
            },
        },
    }, { provider: args.provider });

    return {
        chart
    };
}

import * as k8s from "@pulumi/kubernetes";

export interface PrometheusGrafanaChartConfig {
    version: string;
    grafanaPassword: string;
}

export class PrometheusGrafanaChart {
    constructor(private args: PrometheusGrafanaChartConfig) { }

    getHelmConfig(): k8s.helm.v4.ChartArgs {
        return {
            name: "kube-prometheus",
            namespace: 'default',
            chart: "kube-prometheus-stack",
            repositoryOpts: {
                repo: "https://prometheus-community.github.io/helm-charts",
            },
            version: this.args.version,
            values: {
                grafana: {
                    adminPassword: this.args.grafanaPassword,
                    service: {
                        type: "ClusterIP",
                    },
                    sidecar: {
                        dashboards: {
                            enabled: true,
                        },
                    },
                },
                prometheus: {
                    service: {
                        type: "ClusterIP",
                    },
                },
            },
        };
    }
}

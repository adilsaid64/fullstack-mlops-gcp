import * as k8s from "@pulumi/kubernetes";

export interface PrometheusGrafanaChartConfig {
    version: string;
    grafanaPassword: string;
    namespace?: string;
    serviceType?: "ClusterIP" | "NodePort" | "LoadBalancer";
    serviceAccountName?: string;
    nodeSelector?: Record<string, string>;
    tolerations?: k8s.types.input.core.v1.Toleration[];
    affinity?: k8s.types.input.core.v1.Affinity;
    enableDashboards?: boolean;
    enableAlertmanager?: boolean;
    persistGrafana?: boolean;
    grafanaStorageSize?: string;
}

export class PrometheusGrafanaChart {
    constructor(private args: PrometheusGrafanaChartConfig) { }

    getHelmConfig(): k8s.helm.v3.ReleaseArgs {
        const namespace = this.args.namespace ?? "monitoring";

        return {
            namespace,
            chart: "kube-prometheus-stack",
            version: this.args.version,
            repositoryOpts: {
                repo: "https://prometheus-community.github.io/helm-charts",
            },

            values: {
                grafana: {
                    adminPassword: this.args.grafanaPassword,

                    service: {
                        type: this.args.serviceType ?? "ClusterIP",
                    },

                    persistence: {
                        enabled: this.args.persistGrafana ?? false,
                        size: this.args.grafanaStorageSize ?? "10Gi",
                    },

                    serviceAccount: {
                        create: this.args.serviceAccountName ? false : true,
                        name: this.args.serviceAccountName,
                    },

                    nodeSelector: this.args.nodeSelector,
                    tolerations: this.args.tolerations,
                    affinity: this.args.affinity,

                    sidecar: {
                        dashboards: {
                            enabled: this.args.enableDashboards ?? true,
                        },
                    },
                },

                prometheus: {
                    service: {
                        type: this.args.serviceType ?? "ClusterIP",
                    },
                    nodeSelector: this.args.nodeSelector,
                    tolerations: this.args.tolerations,
                    affinity: this.args.affinity,
                },

                alertmanager: {
                    enabled: this.args.enableAlertmanager ?? true,
                    nodeSelector: this.args.nodeSelector,
                    tolerations: this.args.tolerations,
                    affinity: this.args.affinity,
                },
            },
        };
    }
}

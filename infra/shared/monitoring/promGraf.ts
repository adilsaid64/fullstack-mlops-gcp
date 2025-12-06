import { PrometheusGrafanaChart } from "../../applications/k8s/helm/templates/promethuesGrafana";
import { isLocal, shouldDeploySharedInfra } from "../../utils/utils";
import { customCluster } from "../cluster";
import { monitoringNs } from "./monitoringNs";

function deployPromethuesAndGrafana() {
    // deploy to shared infra and local stacks
    if (shouldDeploySharedInfra() || isLocal()) {
        // deploy promethues to cluster
        const prometheusGrafanaChartConfig = new PrometheusGrafanaChart({
            version: "75.13.0",
            grafanaPassword: 'Password123!',
            namespace: monitoringNs.metadata.namespace,
        });
        const promGrafana = customCluster.deployApplicationViaHelmChart("prom-grafana-helm", { releaseArgs: prometheusGrafanaChartConfig.getHelmConfig() });
        return promGrafana
    } else {
        // preview stacks and non shared stacks dont need a their own deployments
        return undefined;
    }
}

export const promGrafana = deployPromethuesAndGrafana();
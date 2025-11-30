import { PrometheusGrafanaChart } from "../applications/k8s/helm/templates/promethuesGrafana";
import { isLocal, shouldDeploySharedInfra } from "../utils/utils";
import { customCluster } from "./cluster";
import { defaultPassword } from './secrets'


function deployPromethuesAndGrafana() {
    // deploy to shared infra and local stacks
    if (shouldDeploySharedInfra() || isLocal()) {
        // deploy promethues to cluster
        const prometheusGrafanaChartConfig = new PrometheusGrafanaChart({
            version: "75.13.0",
            grafanaPassword: defaultPassword,
        });
        const monitoring = customCluster.deployApplicationViaHelmChart("monitoring", { releaseArgs: prometheusGrafanaChartConfig.getHelmConfig() });
        return monitoring
    } else {
        // get promethues deployment
        return undefined;
    }
}

export const monitoring = deployPromethuesAndGrafana();
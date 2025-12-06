import { isLocal, shouldDeploySharedInfra } from "../../utils/utils";
import { customCluster } from "../cluster";


function createOrGetMonitoringNamespace() {
    if (shouldDeploySharedInfra() || isLocal()) {
        const monitoringNs = customCluster.createNamespace('monitoring-ns', { namespaceArgs: { metadata: { name: 'monitoring' } } });
        return monitoringNs;
    } else {
        const monitoringNs = customCluster.getNamespace('monitoring-ns', 'monitoring')
        return monitoringNs
    }
}

export const monitoringNs = createOrGetMonitoringNamespace()
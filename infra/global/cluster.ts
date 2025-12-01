import { CustomCluster } from "../components/CustomCluster/CustomCluster";
import { shouldDeploySharedInfra } from "../utils/utils"
import { getStack } from "@pulumi/pulumi";

const clusterName = 'customClusters'

function createOrGetCustomCluster(): CustomCluster {
    if (shouldDeploySharedInfra()) {
        // provision a cloud kubernetes cluster
        const customCluster = new CustomCluster(clusterName)
        return customCluster
    } else {
        // attach to an existing cluster
        const customCluster = CustomCluster.get(clusterName)
        return customCluster
    }
}

export const customCluster = createOrGetCustomCluster()

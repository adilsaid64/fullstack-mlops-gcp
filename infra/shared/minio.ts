import cluster from "cluster";
import { isLocal, shouldDeploySharedInfra } from "../utils/utils";
import { customCluster } from "./cluster";
import { MinioHelmChart } from "../applications/k8s/helm/templates/minio";

function deployMinio() {
    if (isLocal()) {
        // deploy minio

        const minioChartConfig = new MinioHelmChart({
            
        })
        customCluster.deployApplicationViaHelmChart(
            'minio-helm', {

        }
        )
    } else {
        // do nothing, we dont need minio if not deploying locally. Other deployments
    }
}
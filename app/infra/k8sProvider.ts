import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as fs from "fs";
import * as os from "os";

export function getK8sProvider(): k8s.Provider {
    const stack = pulumi.getStack();

    if (stack === "local") {
        // Minikube kubeconfig directly from ~/.kube/config
        const kubeconfigPath = `${os.homedir()}/.kube/config`;
        const kubeconfig = fs.readFileSync(kubeconfigPath, "utf8");

        return new k8s.Provider("k8s-minikube", {
            kubeconfig: kubeconfig,
            context: "minikube",
        });
    }

    // if (stack === "prod") {
    //     return new k8s.Provider("k8s-gke", {
    //         kubeconfig: gkeKubeconfig,
    //     });
    // }

    throw new Error(`Unsupported stack: ${stack}`);
}


export const k8sProvider = getK8sProvider()
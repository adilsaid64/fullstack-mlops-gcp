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

        const k8sProvider = new k8s.Provider("k8s-minikube", {
            kubeconfig: kubeconfig,
            context: "minikube",
        });

        return k8sProvider
    }

    if (stack === "prod") {
        // const k8sProvider =  new k8s.Provider("k8s-gke", {
        //     kubeconfig: gkeKubeconfig,
        // });

        // return k8sProvider;
    }

    throw new Error(`Unsupported stack: ${stack}`);
}

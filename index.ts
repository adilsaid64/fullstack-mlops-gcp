// import * as pulumi from "@pulumi/pulumi";
import { k8sProvider } from "./infra/getK8sProvider";
import { deployMLflow } from "./infra/mlflow";
import { deployMySql } from "./infra/local/mysql";


// export const mlflowDeployment = deployMLflow(
//     {
//         provider: k8sProvider,
//         artifactBackend: {}
//     }
// );


export const mySqlDeployment = deployMySql({
    provider: k8sProvider,
    rootPassword: "password",
    user: "admin",
    userPassword: "password",
    database: "mydb"
})
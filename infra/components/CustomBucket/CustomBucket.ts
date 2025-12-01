import { ComponentResource, type Input, type ComponentResourceOptions } from "@pulumi/pulumi";
import { isLocal } from '../../utils'

export interface CustomBucketArgs {
    tags?: Record<string, string>;
}

const __pulumiType = 'myproject:infra:CustomBucket';

export class CustomBucket extends ComponentResource {
    public bucketName: Input<string>;

    constructor(name: string, args?: CustomBucketArgs, opts?: ComponentResourceOptions) {
        super(__pulumiType, name, args, opts)

        if (isLocal()) {
            // provision a minio bucket
            this.bucketName = name;
        } else {
            // provision a cloud bucket from your fav cloud provider
            this.bucketName = name;
        }

        this.registerOutputs({
            bucketName: this.bucketName,
        });
    }
}
import { getStack } from "@pulumi/pulumi";

export const prodStackName = 'prod'
export const devStackName = 'dev'
export const localStackName = 'local'

export function shouldDeploySharedInfra(): boolean {
    const stack = getStack()

    if ([prodStackName, devStackName].includes(getStack())) {
        return true;
    } else {
        return false;
    }
}

export function isProd(): boolean {
    if (getStack() === prodStackName) {
        return true;
    } else {
        return false;
    }
}

export function isDev(): boolean {
    if (getStack() === devStackName) {
        return true;
    } else {
        return false;
    }
}

export function isLocal(): boolean {
    if (getStack() === localStackName) {
        return true;
    } else {
        return false;
    }
}
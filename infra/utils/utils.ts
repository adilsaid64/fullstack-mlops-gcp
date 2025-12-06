import { getStack } from "@pulumi/pulumi";

export const prodStackName = 'prod'
export const devStackName = 'dev'
export const localStackName = 'local'

export function shouldDeploySharedInfra(): boolean {
    const stack = getStack()

    if ([prodStackName, devStackName].includes(stack)) {
        return true;
    } else {
        return false;
    }
}

export function stackToAttachTo(): string {
    // return dev if dev, return staging if staging, return dev if dev
    // return dev if stack ends with dev like adil-dev
    const stack = getStack()

    if ([devStackName].includes(stack)) {
        return devStackName
    } else if ([localStackName].includes(stack)) {
        return localStackName;
    } else {
        return stack;
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
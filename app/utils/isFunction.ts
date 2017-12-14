import {isFunction as isFunc} from "util";

export function isFunction(value: any) {
    return isFunc(value);
}
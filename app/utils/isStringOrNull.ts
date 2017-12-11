import {isString} from "./isString";

export function isStringOrNull(value: any) {
    return (value === null) || isString(value);
}
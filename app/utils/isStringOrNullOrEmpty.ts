import {isString} from "./isString";

export function isStringOrNullOrEmpty(value: any) {
    return !value || (value === null) || (isString(value) && value.trim() === "");
}
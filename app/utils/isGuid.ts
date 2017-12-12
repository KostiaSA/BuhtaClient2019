import {isString} from "./isString";

export function isGuid(value: string): boolean {
    if (!isString(value))
        return false;
    else
        return /^\{?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}?$/.test(value);
}
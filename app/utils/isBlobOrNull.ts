import {isBlob} from "./isBlob";

export function isBlobOrNull(value: any) {
    return (value === null) || isBlob(value);
}
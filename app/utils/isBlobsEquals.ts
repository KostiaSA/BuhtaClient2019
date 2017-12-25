import {isBlob} from "./isBlob";
import {throwError} from "./throwError";

export function isBlobsEqual(value1: any, value2: any): boolean {

    if (!isBlob(value1))
        throwError("'value1': неверный формат Blob");
    if (!isBlob(value2))
        throwError("'value2': неверный формат Blob");

    return btoa(value1) === btoa(value2);
}

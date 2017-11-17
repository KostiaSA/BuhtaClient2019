let objectPath = require("object-path");

export function objectPathSet(object: any, propPath: string, value: any) {
    objectPath.set(object, propPath, value);
}
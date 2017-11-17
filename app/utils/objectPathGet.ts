let objectPath = require("object-path");

export function objectPathGet(object: any, propPath: string, defaultValue?: any): any {
    return objectPath.get(object, propPath, defaultValue);
}
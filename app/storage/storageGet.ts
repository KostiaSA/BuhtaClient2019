import {parse} from "ejson";

let objectPath = require("object-path");

export function storageGet(user: string, path: string, defaultValue: any = null): any {
    let props = path.split(".");

    let key = user + ":" + props[0];
    let obj = localStorage.getItem(key);
    if (obj) {
        let value = objectPath.get(parse(obj), path, null);
        if (value)
            return value;
    }

    key = "<user>:" + props[0];
    obj = localStorage.getItem(key);
    if (obj) {
        let value = objectPath.get(parse(obj), path, null);
        if (value)
            return value;
    }
    else
        return defaultValue;
}
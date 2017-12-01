import {parse, stringify} from "ejson";

let objectPath = require("object-path");

export function storageSet(user: string, path: string, value: any, markAsNeedDoSave: boolean = true) {
    let props = path.split(".");
    let key = user + ":" + props[0];
    let objStr = localStorage.getItem(key);
    let obj: any = {};
    if (objStr)
        obj = parse(objStr);

    if (markAsNeedDoSave)
        obj.$needSave = true;

    objectPath.set(obj, path, value);
    localStorage.setItem(key, stringify(obj));
    console.log("localStorage.setItem", key, obj);

    key = user + ":" + props[0];
    objStr = localStorage.getItem(key);
    obj = {};
    if (objStr)
        obj = parse(objStr);

    if (markAsNeedDoSave)
        obj.$needSave = true;

    objectPath.set(obj, path, value);
    localStorage.setItem(key, stringify(obj));
    console.log("localStorage.setItem", key, obj);

}
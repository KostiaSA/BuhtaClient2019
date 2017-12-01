import {clone, parse, stringify} from "ejson";
import {appState} from "../AppState";

let objectPath = require("object-path");

export function storageSet(key: string, paths: string[], value: any, markAsNeedDoSave: boolean = true) {
    if (paths.length === 0)
        throw "storageSet(): paths.length===0 для key='" + key + "'";
    if (paths.length > 3)
        throw "storageSet(): paths.length>3 для key='" + key + "'";

    for (let i = 0; i < 2; i++) {
        let fullKey = "<user>:" + key;
        if (i > 0)
            fullKey = appState.userId + ":" + key;

        let obj: any = {};
        let objStr = localStorage.getItem(fullKey);
        if (objStr) obj = parse(objStr);

        if (markAsNeedDoSave)
            obj.$needSave = true;

        objectPath.set(obj, paths[0], clone(value));
        if (paths[1])
            objectPath.set(obj, paths[0] + "." + paths[1], clone(value));
        if (paths[2])
            objectPath.set(obj, paths[0] + "." + paths[1] + "." + paths[2], clone(value));

        localStorage.setItem(fullKey, stringify(obj));
        //console.log("localStorage.setItem", key, obj);
    }

}

import {appState} from "../AppState";
import {XJSON_clone, XJSON_parse, XJSON_stringify} from "../utils/xjson";
import {throwError} from "../utils/throwError";

let objectPath = require("object-path");

export function storageSet(key: string, paths: string[], value: any, markAsNeedDoSave: boolean = true) {
    if (paths.length === 0)
        throwError( "storageSet(): paths.length===0 для key='" + key + "'");
    if (paths.length > 3)
        throwError( "storageSet(): paths.length>3 для key='" + key + "'");

    for (let i = 0; i < 2; i++) {
        let fullKey = "<user>:" + key;
        if (i > 0)
            fullKey = appState.userId + ":" + key;

        let obj: any = {};
        let objStr = localStorage.getItem(fullKey);
        if (objStr) obj = XJSON_parse(objStr);

        if (markAsNeedDoSave)
            obj.$needSave = true;

        objectPath.set(obj, paths[0], XJSON_clone(value));
        if (paths[1])
            objectPath.set(obj, paths[0] + "." + paths[1], XJSON_clone(value));
        if (paths[2])
            objectPath.set(obj, paths[0] + "." + paths[1] + "." + paths[2], XJSON_clone(value));

        localStorage.setItem(fullKey, XJSON_stringify(obj));
        console.log("localStorage.setItem", key, obj);
    }

}
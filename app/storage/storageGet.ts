
import {appState} from "../AppState";
import {XJSON_parse} from "../utils/xjson";
import {throwError} from "../utils/throwError";

let objectPath = require("object-path");

export function storageGet(key: string, paths: string[], defaultValue: any = null): any {
    if (paths.length === 0)
        throwError( "storageSet(): paths.length===0 для key='" + key + "'");
    if (paths.length > 3)
        throwError( "storageSet(): paths.length>3 для key='" + key + "'");


    for (let i = 0; i < 2; i++) {
        let fullKey = "<user>:" + key;
        if (i === 0)
            fullKey = appState.userId + ":" + key;

        let objStr = localStorage.getItem(fullKey);

        if (objStr) {
            let obj = XJSON_parse(objStr);
            if (paths[2]) {
                let value = objectPath.get(obj, paths[0] + "." + paths[1] + "." + paths[2], null);
                if (value) return value;
            }
            if (paths[1]) {
                let value = objectPath.get(obj, paths[0] + "." + paths[1], null);
                if (value) return value;
            }
            let value = objectPath.get(obj, paths[0], null);
            if (value) return value;

        }
    }

    return defaultValue;
}
import {arrayBufferToBase64} from "./arrayBufferToBase64";
import {base64ToArrayBuffer} from "./base64ToArrayBuffer";
import * as moment from "moment";
import {guidFromBase64, guidToBase64} from "./guid";
import {throwError} from "./throwError";

export function XJSON_stringify(obj: any): string {
    return JSON.stringify(stringify_prepare(obj));
}


function stringify_prepare(obj: any): any {
    switch (typeof obj) {
        case "undefined":
            return undefined;
        case "boolean":
            return obj;
        case "number":
            return obj;
        case "symbol":
            throwError( "XJSON_stringify(): тип 'Symbol' недопустим");
        case "function":
            throwError( "XJSON_stringify(): тип 'Function ' недопустим");
        case "string":
            if (obj.startsWith("<"))
                return "<" + obj;
            else
                return obj;
        case "object": {
            if (obj === null) {
                return null;
            }
            else if (obj instanceof Date) {
                throwError( "XJSON_stringify(): тип 'Date' недопустим, используйте 'Moment'");
            }
            else if (obj._isAMomentObject) {
                if (obj.year() === 0 && obj.month() === 1 && obj.date() === 1)
                    return "<Time>" + obj.format("HH:mm:ss.SSS");
                else {
                    let str = obj.format("YYYY-MM-DD HH:mm:ss.SSS").replace(" 00:00:00.000", "");
                    if (str.length === 10)
                        return "<Date>" + str;
                    else
                        return "<DateTime>" + str;
                }
            }
            else if (Array.isArray(obj)) {
                return obj.map((item) => stringify_prepare(item))
            }
            else if (obj instanceof ArrayBuffer) {
                return "<ArrayBuffer>" + arrayBufferToBase64(obj);
            }
            else if (obj instanceof Uint8Array) {
                return "<Uint8Array>" + arrayBufferToBase64(obj.buffer);
            }
            else if (obj instanceof Uint32Array && obj.length===4) {
                return "<Guid>" + guidToBase64(obj);
            }
            else {
                let cloned: any = {};
                for (let key of Object.keys(obj)) {
                    cloned[key] = stringify_prepare(obj[key])
                }
                return cloned;
            }
        }
    }
    throwError( "stringify_prepare():internal error");
}

export function XJSON_parse(json: string): any {
    let obj = JSON.parse(json);
    obj = XJSON_parse_postprocess(obj);
    return obj;
}

export function XJSON_parse_postprocess(obj: any): any {
    switch (typeof obj) {
        case "string":
            if (obj.startsWith("<")) {
                if (obj.startsWith("<ArrayBuffer>")) {
                    return base64ToArrayBuffer(obj.substr("<ArrayBuffer>".length))
                }
                else if (obj.startsWith("<Uint8Array>")) {
                    return new Uint8Array(base64ToArrayBuffer(obj.substr("<Uint8Array>".length)))
                }
                else if (obj.startsWith("<Guid>")) {
                    return guidFromBase64(obj.substr("<Guid>".length))
                }
                else if (obj.startsWith("<Date>")) {
                    return moment(obj.substr("<Date>".length))
                }
                else if (obj.startsWith("<DateTime>")) {
                    return moment(obj.substr("<DateTime>".length))
                }
                else if (obj.startsWith("<Time>")) {
                    return moment("0000-01-01 " + obj.substr("<Time>".length))
                }
                else
                    return obj.substr(1);
            }
            else
                return obj;
        case "object": {
            if (obj === null) {
                return obj;
            }
            else if (Array.isArray(obj)) {
                obj.forEach((item: any, index: number) => obj[index] = XJSON_parse_postprocess(item));
                return obj;
            }
            else {
                for (let key of Object.keys(obj)) {
                    obj[key] = XJSON_parse_postprocess(obj[key]);
                }
                return obj;
            }
        }
        default:
            return obj;
    }
    //throw "XJSON_parse_postprocess():internal error";
}

export function XJSON_clone(obj: any): any {
    return XJSON_parse(XJSON_stringify(obj));
}

export function XJSON_equals(obj1: any, obj2: any): any {
    return XJSON_stringify(obj1) === XJSON_stringify(obj2);
}

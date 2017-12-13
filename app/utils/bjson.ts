import {arrayBufferToBase64} from "./arrayBufferToBase64";
import {base64ToArrayBuffer} from "./base64ToArrayBuffer";
import * as moment from "moment";

export function BJSON_stringify(obj: any): string {
    return JSON.stringify(BJSON_stringify_prepare(obj));
}


function BJSON_stringify_prepare(obj: any): any {
    switch (typeof obj) {
        case "undefined":
            return undefined;
        case "boolean":
            return obj;
        case "number":
            return obj;
        case "symbol":
            throw "BJSON_stringify(): тип 'Symbol' недопустим";
        case "function":
            throw "BJSON_stringify(): тип 'Function ' недопустим";
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
                throw "BJSON_stringify(): тип 'Date' недопустим, используйте 'Moment'";;
            }
            else if (obj._isAMomentObject) {
                return "<Date>" + obj.format("YYYY-MM-DD HH:mm:ss.SSS").replace("00:00:00.000", "");
            }
            else if (Array.isArray(obj)) {
                return obj.map((item) => BJSON_stringify_prepare(item))
            }
            else if (obj instanceof ArrayBuffer) {
                return "<ArrayBuffer>" + arrayBufferToBase64(obj);
            }
            else if (obj instanceof Uint8Array) {
                return "<Uint8Array>" + arrayBufferToBase64(obj.buffer);
            }
            else {
                let cloned: any = {};
                for (let key of Object.keys(obj)) {
                    cloned[key] = BJSON_stringify_prepare(obj[key])
                }
                return cloned;
            }
        }
    }
    throw "BJSON_stringify_prepare():internal error";
}

export function BJSON_parse(json: string): any {
    let obj = JSON.parse(json);
    obj = BJSON_parse_postprocess(obj);
    return obj;
}

function BJSON_parse_postprocess(obj: any): any {
    switch (typeof obj) {
        case "string":
            if (obj.startsWith("<")) {
                if (obj.startsWith("<ArrayBuffer>")) {
                    return base64ToArrayBuffer(obj.substr("<ArrayBuffer>".length))
                }
                else if (obj.startsWith("<Uint8Array>")) {
                    return new Uint8Array(base64ToArrayBuffer(obj.substr("<Uint8Array>".length)))
                }
                else if (obj.startsWith("<Date>")) {
                    return moment(obj.substr("<Date>".length))
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
                obj.forEach((item: any, index: number) => obj[index] = BJSON_stringify_prepare(item));
                return obj;
            }
            else {
                for (let key of Object.keys(obj)) {
                    obj[key] = BJSON_parse_postprocess(obj[key]);
                }
                return obj;
            }
        }
        default:
            return obj;
    }
    //throw "BJSON_parse_postprocess():internal error";
}

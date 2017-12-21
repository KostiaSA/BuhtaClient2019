import {isString} from "./isString";
import {throwError} from "./throwError";

export function hexStringToUint8Array(hexStr: string):Uint8Array {

    if (!isString(hexStr))
        throwError( "hexStringToUint8Array(hexStr): 'hexStr' должна быть строкой");

    try {
        return new Uint8Array(hexStr.match(/[\da-f]{2}/gi)!.map(function (h) {
            return parseInt(h, 16);
        }))
    }
    catch {
        throwError( "hexStringToUint8Array(hexStr): неверный формат 'hexStr': '" + hexStr + "'");
        throw "fake";
    }

}
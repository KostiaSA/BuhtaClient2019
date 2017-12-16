import {isString} from "./isString";

export function hexStringToUint8Array(hexStr: string):Uint8Array {

    if (!isString(hexStr))
        throw "hexStringToUint8Array(hexStr): 'hexStr' должна быть строкой";

    try {
        return new Uint8Array(hexStr.match(/[\da-f]{2}/gi)!.map(function (h) {
            return parseInt(h, 16);
        }))
    }
    catch {
        throw "hexStringToUint8Array(hexStr): неверный формат 'hexStr': '" + hexStr + "'";
    }

}
import {isString} from "./isString";
import {hexStringToUint8Array} from "./hexStringToUint8Array";
import {throwError} from "./throwError";

export type Guid = Uint32Array;

export function newGuid(): Guid {
    let a = new Uint32Array(4);
    crypto.getRandomValues(a);
    return a;
}

export function emptyGuid(): Guid {
    return new Uint32Array(4);
}

export function minGuid(): Guid {
    return new Uint32Array(4);
}

export function maxGuid(): Guid {
    let a = new Uint32Array(4);
    a[0] = 4294967295;
    a[1] = 4294967295;
    a[2] = 4294967295;
    a[3] = 4294967295;
    return a;
}

export function isGuid(value: any): boolean {
    return value && value.constructor === Uint32Array && value.length === 4;
}

export function isGuidOrNull(value: any): boolean {
    return value === null || isGuid(value);
}

export function checkGuid(value: any, message: string = "ошибка") {
    if (!isGuid(value))
        throwError( message + ": неверный формат Guid");

}

export function isGuidsEqual(value1: Guid, value2: Guid): boolean {
    checkGuid(value1, "isGuidsEqual");
    checkGuid(value2, "isGuidsEqual");
    return value1[0] === value2[0] && value1[1] === value2[1] &&
        value1[2] === value2[2] && value1[3] === value2[3];
}

export function guidToBase64(value: Guid): string {
    checkGuid(value, "guidToBase64");

    let binary = "";
    let bytes = new DataView(value.buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes.getUint8(i));
    }
    return window.btoa(binary);
}

export function guidFromBase64(base64: string): Guid {
    if (!isString(base64))
        throwError( "guidFromBase64(): base64 должно быть строкой");

    let binary_string = window.atob(base64);
    if (binary_string.length !== 16)
        throwError( "guidFromBase64(): неверный формат Guid '" + base64 + "'");

    let guid = new Uint32Array(4);
    let bytes = new DataView(guid.buffer);
    for (let i = 0; i < 16; i++) {
        bytes.setUint8(i, binary_string.charCodeAt(i));
    }
    return guid;
}

export function guidToHex(value: Guid): string {
    checkGuid(value, "guidToHex");

    let bytes = new DataView(value.buffer);
    let str = "";
    for (let i = 0; i < 16; i++) {
        str += ("0" + (bytes.getUint8(i) & 0xFF).toString(16)).slice(-2);
        if (i === 3 || i == 5 || i == 7 || i == 9)
            str += "-";
    }
    return str;
}

export function guidFromHex(hex: string): Guid {
    if (!isString(hex))
        throwError( "guidFromHex(hex): 'hex' должен быть строкой в формате '8d950d6b-0929-4de1-b79c-eb06ab932caf'");

    return new Uint32Array(hexStringToUint8Array(hex).buffer);
}


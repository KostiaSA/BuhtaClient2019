
import {isArrayBuffer} from "./isArrayBuffer";
import {throwError} from "./throwError";

export function arrayBufferToBase64(buffer: ArrayBuffer): string {

    if (!isArrayBuffer(buffer))
        throwError( "arrayBufferToBase64(): buffer должен быть объектом 'ArrayBuffer'");

    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
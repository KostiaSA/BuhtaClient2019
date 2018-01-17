import {replaceAll} from "./replaceAll";

export function getRandomString(length: number = 20): string {
    if (length <= 11) {
        let str = Math.random().toString(36).slice(2);
        return str.slice(0, length);
    }
    else
    if (length <= 22) {
        let str = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        return str.slice(0, length);
    }

    let binary = "";
    let bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    let ret = window.btoa(binary).substr(0, length);
    ret = replaceAll(ret, "+", "Q");
    ret = replaceAll(ret, "/", "Z");

    return ret;
}

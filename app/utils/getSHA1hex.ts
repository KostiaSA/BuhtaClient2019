import * as CryptoJS from "crypto-js";

export function getSHA1hex(str: string): string {
    return CryptoJS.enc.Hex.stringify(CryptoJS.SHA1(str));
}
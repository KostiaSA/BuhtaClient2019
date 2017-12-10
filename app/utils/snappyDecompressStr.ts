import {base64ToArrayBuffer} from "./base64ToByteArray";

declare let SnappyJS: any;
declare let TextDecoder: any;

export function snappyDecompressStr(compressedBase64: string): string {
    let compressedArrayBuffer = base64ToArrayBuffer(compressedBase64);
    let uncompressedArrayBuffer = SnappyJS.uncompress(compressedArrayBuffer);
    return new TextDecoder().decode(uncompressedArrayBuffer);
}
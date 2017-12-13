
// https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer

export function base64ToArrayBuffer(base64:string):ArrayBuffer {
    let binary_string =  window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
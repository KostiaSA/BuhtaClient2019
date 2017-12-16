
export function arrayToHexString(byteArray: ArrayLike<any>) {
    return Array.from(byteArray, (byte: any) => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join("")
}

export function isBlob(value: any): boolean {
    return value instanceof ArrayBuffer;
}
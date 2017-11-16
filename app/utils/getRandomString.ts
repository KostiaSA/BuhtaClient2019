export function getRandomString(length: number = 20): string {
    let str=Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
    return "a"+str.slice(0, length);
}

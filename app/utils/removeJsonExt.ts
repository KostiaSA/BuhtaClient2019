export function removeJsonExt(str: string): string {
    if (str.endsWith(".json")) {
        let words = str.split(".json");
        words.pop();
        return words.join("");
    }
    return str;
}
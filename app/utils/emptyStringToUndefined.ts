import {isString} from "./isString";

export function emptyStringToUndefined(str: string | null | undefined): string | undefined {
    if (isString(str)) {
        if (str!.trim() === "")
            return undefined;
        else
            return str!;
    }
    else
        return undefined;
}
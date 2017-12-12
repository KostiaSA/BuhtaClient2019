import {isNumber} from "util";

export function isMoney(value: number): boolean {
    if (!isNumber(value))
        return false;
    else
        return true;
}
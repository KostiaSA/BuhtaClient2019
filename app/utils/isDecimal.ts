import {isNumber} from "util";

export function isDecimal(value: number): boolean {
    if (!isNumber(value))
        return false;
    else
        return true;
}
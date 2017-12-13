
import {isBoolean} from "./isBoolean";

export function isBooleanOrNull(value: any) {
    return (value === null) || isBoolean(value);
}
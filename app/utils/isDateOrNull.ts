
import {isDate} from "./isDate";

export function isDateOrNull(value: any) {
    return (value === null) || isDate(value);
}
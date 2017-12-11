import {isInteger} from "./isInteger";

export function isIntegerOrNull(value: any) {
    return (value === null) || isInteger(value);
}
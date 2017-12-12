
import {isGuid} from "./isGuid";

export function isGuidOrNull(value: any) {
    return (value === null) || isGuid(value);
}
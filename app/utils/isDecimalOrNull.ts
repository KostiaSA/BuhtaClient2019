

import {isDecimal} from "./isDecimal";

export function isDecimalOrNull(value: any) {
    return (value === null) || isDecimal(value);
}
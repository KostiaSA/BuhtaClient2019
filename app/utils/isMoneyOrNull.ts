
import {isMoney} from "./isMoney";

export function isMoneyOrNull(value: any) {
    return (value === null) || isMoney(value);
}
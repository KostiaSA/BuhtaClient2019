import {config} from "../config";
import {notifySuccess} from "./notifySuccess";
import {notifyError} from "./notifyError";

export function throwWarning(msg: any, ...p: any[]) {
    if (!config.productionMode) {
        let errs: any[] = [msg];
        if (p) {
            p.forEach((value, index) => {
                errs.push(", ");
                errs.push(value);
                errs.push("(" + typeof value + ")");
            });
        }
        console.warn("<-- здесь смотри call stack по предупреждению, которое ниже");
        console.warn(...errs);
    }
}

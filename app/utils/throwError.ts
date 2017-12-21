import {config} from "../config";

export function throwError(msg: any, ...p: any[]) {
    if (!config.productionMode) {
        let errs: any[] = [msg];
        if (p) {
            p.forEach((value, index) => {
                errs.push(", ");
                errs.push(value);
                errs.push("(" + typeof value + ")");
            });
        }
        console.error(...errs);
    }
    throw msg;
}

import * as moment from "moment";

export function isDate(value: number): boolean {
    return moment.isMoment(value);
}
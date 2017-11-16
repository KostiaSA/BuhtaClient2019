export interface IClassInfo<T> {
    className: string;
    constructor: T;
    recordIdPrefix?: string;
}
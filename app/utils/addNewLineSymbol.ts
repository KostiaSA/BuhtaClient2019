import {isString} from "./isString";

export function addNewLineSymbol(str: string): string {
    if (!isString(str))
        throw "addNewLineSymbol(str): параметр 'str' дожен быть строкой";

    if (str.endsWith("\n"))
        return str;
    else
        return str + "\n";
}
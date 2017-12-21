import {isString} from "./isString";
import {throwError} from "./throwError";

export function addNewLineSymbol(str: string): string {
    if (!isString(str))
        throwError( "addNewLineSymbol(str): параметр 'str' дожен быть строкой");

    if (str.endsWith("\n"))
        return str;
    else
        return str + "\n";
}
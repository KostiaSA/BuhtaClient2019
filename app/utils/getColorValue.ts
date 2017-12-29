import {userColors} from "./registerUserColor";
import {throwError} from "./throwError";
import {isString} from "./isString";

export function getColorValue(color: string): string {
    if (!isString(color)) {
        throwError("getColorValue(): 'color' должен быть строкой");
        throw "fake";
    }

    if (color.startsWith("$")) {
        let userColor = userColors[color];
        if (!userColor) {
            throwError("getColorValue(): на найден цвет " + color);
            throw "fake";
        }
        else
            return userColor.value;
    }
    else
        return color;
}
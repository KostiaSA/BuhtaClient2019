import {isString} from "./isString";
import {throwError} from "./throwError";

export interface IUserColor {
    group: string;
    name: string;
    value: string;
}

export let userColors: { [colorId: string]: IUserColor; };

export function registerUserColor(colorName: string, colorValue: string, colorGroup: string) {
    if (!isString(colorName))
        throwError("registerUserColor(): 'colorName' должен быть строкой");
    if (!isString(colorValue))
        throwError("registerUserColor(): 'colorValue' должен быть строкой");
    if (!isString(colorGroup))
        throwError("registerUserColor(): 'colorGroup' должен быть строкой");

    let colorId = "$" + colorGroup + "$" + colorName;

    if (userColors[colorId])
        throwError("registerUserColor(): такой цвет уже зарегистрирован '" + colorId + "'");

    userColors[colorId] = {
        group: colorGroup,
        name: colorName,
        value: colorValue
    }

}
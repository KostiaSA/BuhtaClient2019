import axios from "axios";
import {SqlDialect} from "../../sql/SqlEmitter";
import {isString} from "util";
import {XJSON_stringify} from "../../utils/xjson";
import {throwError} from "../../utils/throwError";
import {appState} from "../../AppState";

export interface ISchemaObjectFiles {
    sqlTemplate: string;
    dialect: string;
    params: string;
}

export async function generateSqlFromTemplate(dialect: SqlDialect, sqlTemplate: string, paramsObj: any = {}): Promise<string> {
    if (!isString(sqlTemplate))
        throwError( "adminExecuteSql(): параметр 'sqlTemplate' должен быть строкой");

    if (!isString(dialect))
        throwError( "adminExecuteSql(): параметр 'dialect' должен быть строкой");

    let req = {
        sessionId:appState.sessionId,
        windowId:appState.windowId,
        authToken:appState.authToken,
        dialect: dialect,
        sqlTemplate: sqlTemplate,
//        paramsObj: XJSON_stringify(paramsObj),
        paramsObj: paramsObj,
    };

    let response: any = await axios.post("api/admin/generateSqlFromTemplate", {xjson:XJSON_stringify(req)});

    if (response.data.error)
        throwError( response.data.error);
    else
        return response.data.sql;

    throw "fake";
}
import axios from "axios";
import {SqlBatch} from "../../sql/SqlEmitter";
import {isArray, isString} from "util";
import {postProcessSqlResult} from "../../sql/postProcessSqlResult";
import {ISqlDataset} from "../../api/executeSql";
import {throwError} from "../../utils/throwError";
import {appState} from "../../AppState";
import {XJSON_stringify} from "../../utils/xjson";

declare let SnappyJS: any;
declare let TextDecoder: any;
declare let TextEncoder: any;


export async function adminExecuteSql(database: string, sql: SqlBatch): Promise<ISqlDataset[]>|never {
    if (!isString(database))
        throwError("adminExecuteSql(): database должен быть строкой");

    let req: any = {
        sessionId:appState.sessionId,
        windowId:appState.windowId,
        authToken:appState.authToken,
        database:database
    };

    if (isString(sql))
        req.sql = [sql];
    else if (isArray(sql))
        req.sql = sql;
    else
        throwError("adminExecuteSql(): sql должен быть строкой или массивом строк");

    let response: any = await axios.post("api/admin/adminExecuteSql", {xjson:XJSON_stringify(req)});

    if (response.data.error)
        throwError(response.data.error);
    else
        return postProcessSqlResult(response.data);

    throw "fake";
}
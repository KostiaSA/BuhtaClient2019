import axios from "axios";
import {isString} from "util";
import {config} from "../config";
import {XJSON_stringify} from "../utils/xjson";
import {postProcessSqlResult} from "./postProcessSqlResult";
import {throwError} from "../utils/throwError";


export interface ISqlDataset {
    columns: { name: string, type: string }[];
    rows: any[];    // к полям обращаемся по имени
    _rows_: any[];  // к полям обращаемся по индексу
}

export async function executeSql(sqlTemplatePath: string, paramsObj: any = {}, dbName: string = config.mainDatabaseName): Promise<ISqlDataset[]> {
    if (!isString(sqlTemplatePath)) {
        let msg = "executeSql(): параметр 'sqlTemplatePath' должен быть строкой";
        console.error(msg, sqlTemplatePath);
        throwError( msg);
    }

    if (!isString(dbName)) {
        let msg = "executeSql(): параметр 'dbName' должен быть строкой";
        console.error(msg, dbName);
        throwError( msg);
    }

    if (typeof paramsObj !== "object") {
        throwError("executeSql(): параметр 'paramsObj' должен быть объектом", paramsObj);
        // let msg = "executeSql(): параметр 'paramsObj' должен быть объектом";
        // console.error(msg, paramsObj);
        // throw msg;
    }

    let req = {
        sqlTemplatePath: sqlTemplatePath,
        paramsObj: XJSON_stringify(paramsObj),
        dbName: dbName
    };

    let response: any = await axios.post("api/executeSql", req);

    if (response.data.error)
        throwError( response.data.error);
    else
        return postProcessSqlResult(response.data)

    throw "fake";

}
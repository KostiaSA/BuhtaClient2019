import axios from "axios";
import {isString} from "util";
import {config} from "../config";
import {XJSON_stringify} from "../utils/xjson";
import {postProcessSqlResult} from "./postProcessSqlResult";


export async function executeSql(sqlTemplatePath: string, paramsObj: any = {}, dbName: string = config.mainDatabaseName): Promise<string> {
    if (!isString(sqlTemplatePath))
        throw "executeSql(): параметр 'sqlTemplatePath' должен быть строкой";

    if (!isString(dbName))
        throw "executeSql(): параметр 'dbName' должен быть строкой";

    if (typeof paramsObj !== "object")
        throw "executeSql(): параметр 'paramsObj' должен быть объектом";

    let req = {
        sqlTemplatePath: sqlTemplatePath,
        paramsObj: XJSON_stringify(paramsObj),
        dbName: dbName
    };

    let response: any = await axios.post("api/executeSql", req);

    if (response.data.error)
        throw response.data.error;
    else
        return postProcessSqlResult(response.data)


}
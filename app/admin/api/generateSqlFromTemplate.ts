import axios from "axios";
import {SqlDialect} from "../../sql/SqlEmitter";
import {isString} from "util";
import {XJSON_stringify} from "../../utils/xjson";

export interface ISchemaObjectFiles {
    sqlTemplate: string;
    dialect: string;
    params: string;
}

export async function generateSqlFromTemplate(dialect: SqlDialect, sqlTemplate: string, paramsObj: any = {}): Promise<string> {
    if (!isString(sqlTemplate))
        throw "adminExecuteSql(): параметр 'sqlTemplate' должен быть строкой";

    if (!isString(dialect))
        throw "adminExecuteSql(): параметр 'dialect' должен быть строкой";

    let req = {
        dialect: dialect,
        sqlTemplate: sqlTemplate,
        paramsObj: XJSON_stringify(paramsObj),
    };

    let response: any = await axios.post("api/admin/generateSqlFromTemplate", req);

    if (response.data.error)
        throw response.data.error;
    else
        return response.data.sql;

}
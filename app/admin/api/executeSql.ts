import axios from "axios";
import {SqlBatch} from "../../sql/SqlEmitter";
import {isArray, isString} from "util";
import {postProcessSqlResult} from "../../sql/postProcessSqlResult";

declare let SnappyJS: any;
declare let TextDecoder: any;
declare let TextEncoder: any;


export async function executeSql(database: string, sql: SqlBatch): Promise<any> {
    if (!isString(database))
        throw "executeSql(): database должен быть строкой";

    let req: any = {database};
    if (isString(sql))
        req.sql = [sql];
    else if (isArray(sql))
        req.sql = sql;
    else
        throw "executeSql(): sql должен быть строкой или массивом строк";

    let response: any = await axios.post("api/admin/executeSql", req);

    return postProcessSqlResult(response.data)


}
import axios from "axios";
import {SqlBatch} from "../../sql/SqlEmitter";
import {isArray, isString} from "util";
import {postProcessSqlResult} from "../../sql/postProcessSqlResult";
import {ISqlDataset} from "../../sql/executeSql";

declare let SnappyJS: any;
declare let TextDecoder: any;
declare let TextEncoder: any;


export async function adminExecuteSql(database: string, sql: SqlBatch): Promise<ISqlDataset[]> {
    if (!isString(database))
        throw "adminExecuteSql(): database должен быть строкой";

    let req: any = {database};
    if (isString(sql))
        req.sql = [sql];
    else if (isArray(sql))
        req.sql = sql;
    else
        throw "adminExecuteSql(): sql должен быть строкой или массивом строк";

    let response: any = await axios.post("api/admin/adminExecuteSql", req);

    if (response.data.error)
        throw response.data.error;
    else
        return postProcessSqlResult(response.data)


}
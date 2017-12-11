import axios from "axios";
import {SqlBatch} from "../../sql/SqlEmitter";
import {isArray, isString} from "util";
import {snappyDecompressStr} from "../../utils/snappyDecompressStr";

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

    let response: any = await axios.post('api/admin/executeSql', req);

    if (response.data.error)
        throw response.data.error;
    else {
        if (response.data.json) {
            let res = JSON.parse(response.data.json);
            return res.rowsets;
        }
        else { // было упаковано на стороне сервера
            let json = snappyDecompressStr(response.data.compressed);
            let res = JSON.parse(json);
            return res.rowsets;
        }
    }

}
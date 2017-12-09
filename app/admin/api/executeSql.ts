import axios from "axios";
import {SqlBatch} from "../../sql/SqlEmitter";
import {isArray, isString} from "util";


export async function executeSql(database: string, sql: SqlBatch): Promise<any> {

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
        let res = JSON.parse(response.data.json);
        return res.rowsets;
    }

}
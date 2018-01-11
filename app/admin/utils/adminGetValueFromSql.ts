import {SqlBatch} from "../../sql/SqlEmitter";
import {throwError} from "../../utils/throwError";
import {adminExecuteSql} from "../api/adminExecuteSql";

export async function adminGetValueFromSql(database: string, sql: SqlBatch): Promise<any> | never {

    let dataset = await adminExecuteSql(database, sql);
    let _rows_ = dataset[0]._rows_;
    if (_rows_.length === 0)
        throwError("adminGetValueFromSql(): запрос не вернул результат");
    else
        return _rows_[0][0];

    throw "fake";
}
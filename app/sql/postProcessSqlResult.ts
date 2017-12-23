import {snappyDecompressStr} from "../utils/snappyDecompressStr";
import {XJSON_parse} from "../utils/xjson";
import {throwError} from "../utils/throwError";

declare let TextDecoder: any;

export function postProcessSqlResult(responseData: any): any {
    if (responseData.error)
        throwError( responseData.error);

    let res: any;

    if (responseData.json) {
        res = XJSON_parse(responseData.json);
    }
    else { // было упаковано на стороне сервера
        let json = snappyDecompressStr(responseData.compressed);
        res = XJSON_parse(json);
    }

    for (let rowsetIndex = 0; rowsetIndex < res.rowsets.length; rowsetIndex++) {
        let rowset = res.rowsets[rowsetIndex];
        rowset._rows_ = rowset.rows;
        rowset.rows = [];
        for (let rowIndex = 0; rowIndex < rowset._rows_.length; rowIndex++) {
            let rowObject: any = {};
            rowset.rows[rowIndex] = rowObject;
            for (let colIndex = 0; colIndex < rowset._rows_[rowIndex].length; colIndex++) {
                let value = rowset._rows_[rowIndex][colIndex];
                rowObject[rowset.columns[colIndex].name] = value;
            }
        }
    }

    return res.rowsets;
}


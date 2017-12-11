import {snappyDecompressStr} from "../utils/snappyDecompressStr";

//declare let SnappyJS: any;
declare let TextDecoder: any;

//declare let TextEncoder: any;

export function postProcessSqlResult(responseData: any): any {
    if (responseData.error)
        throw responseData.error;

    let res: any;

    if (responseData.json) {
        res = JSON.parse(responseData.json);
    }
    else { // было упаковано на стороне сервера
        let json = snappyDecompressStr(responseData.compressed);
        res = JSON.parse(json);
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
                if (typeof value === "object") {
                    if (value.t === "N") { // null
                        value = null;
                    }
                    else if (value.t === "D") {  // date
                        value = new Date(value.v);
                    }
                    else if (value.t === "T") { //time
                        value = {
                            h: value.h,
                            m: value.m,
                            s: value.s,
                            ms: value.ms
                        };
                        console.log(rowset._rows_[rowIndex][colIndex]);
                    }
                    rowset._rows_[rowIndex][colIndex] = value;
                }
                rowObject[rowset.columns[colIndex].name] = value;
                //rowset.rows[rowIndex][rowset.columns[colIndex].name] = value;

            }
        }
    }

    return res.rowsets;

}

// export async function executeSql(database: string, sql: SqlBatch): Promise<any> {
//     if (!isString(database))
//         throw "executeSql(): database должен быть строкой";
//
//     let req: any = {database};
//     if (isString(sql))
//         req.sql = [sql];
//     else if (isArray(sql))
//         req.sql = sql;
//     else
//         throw "executeSql(): sql должен быть строкой или массивом строк";
//
//     let response: any = await axios.post('api/admin/executeSql', req);
//
//     return postProcessSqlResult(response.data)
//     // let res;
//     //
//     // if (response.data.error)
//     //     throw response.data.error;
//     // else {
//     //     // if (response.data.json) {
//     //     //     res = JSON.parse(response.data.json);
//     //     //     //return res.rowsets;
//     //     // }
//     //     // else { // было упаковано на стороне сервера
//     //     //     let json = snappyDecompressStr(response.data.compressed);
//     //     //     res = JSON.parse(json);
//     //     //     //return res.rowsets;
//     //     // }
//     // }
//
//     // for (let rowsetIndex = 0; rowsetIndex < res.rowsets.length; rowsetIndex++) {
//     //     let rowset = res.rowsets[rowsetIndex];
//     //     for (let rowIndex = 0; rowIndex < rowset.rows.length; rowIndex++) {
//     //         for (let colIndex = 0; colIndex < rowset.rows[rowIndex].length; colIndex++) {
//     //             let value = rowset.rows[rowIndex][colIndex];
//     //             if (typeof value === "object") {
//     //                 if (value.t === "N") { // null
//     //                     value = null;
//     //                 }
//     //                 else if (value.t === "D") {  // date
//     //                     value = new Date(value.v);
//     //                 }
//     //                 else if (value.t === "T") { //time
//     //                     value = {
//     //                         h: value.h,
//     //                         m: value.m,
//     //                         s: value.s,
//     //                         ms: value.ms
//     //                     };
//     //                     console.log(rowset.rows[rowIndex][colIndex]);
//     //                 }
//     //                 rowset.rows[rowIndex][colIndex] = value;
//     //             }
//     //             rowset.rows[rowIndex][rowset.columns[colIndex].name] = value;
//     //
//     //         }
//     //     }
//     // }
//
//     //return res.rowsets;
//
//
// }
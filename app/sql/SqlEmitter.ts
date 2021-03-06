import {Moment} from "moment";
import {Guid, guidToHex} from "../utils/guid";
import {arrayToHexString} from "../utils/arrayToHexString";
import {throwError} from "../utils/throwError";

export type SqlDialect = "mssql" | "postgres" | "mysql";

export type SqlBatch = string | string[];

export class SqlEmitter {

    constructor(public dialect: SqlDialect) {

    }

    private mssql_escape_string(str: string) {
        return str.replace(/./g, function (char: string): string {
            switch (char) {
                case "'":
                    return "''";
                default:
                    return char;
            }
        });
    }

    private postgres_escape_string(str: string) {
        return str.replace(/./g, function (char: string): string {
            switch (char) {
                case "\0":
                    return "";
                case "'":
                    return "''";
                default:
                    return char;
            }
        });
    }

    private mysql_escape_string(str: string) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\]/g, function (char: string): string {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\Z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                    return "\\" + char;
                default:
                    throwError( "mysql_escape_string?");
                    throw "fake";
            }
        });
    }


    emit_HEX(bytes: any[]) {
        return bytes.map(function (byte: any) {
            return ("00" + (byte & 0xFF).toString(16)).slice(-2);
        }).join("");
    }

    private mysql_guid_to_str(guid: any): string {
        return "0x" + this.emit_HEX(guid);
    }

    emit_NULL(): string {

        if (this.dialect === "mssql")
            return "NULL";
        else if (this.dialect === "postgres")
            return "NULL";
        else if (this.dialect === "mysql")
            return "NULL";
        else {
            let msg = "invalid sql dialect " + this.dialect;
            throwError( msg + ", " + __filename);
            throw "fake";

        }

    }

    emit_TABLE_NAME(tableName: string, isTemp: boolean = false): string {
        if (isTemp && this.dialect === "mssql")
            return this.emit_NAME("#" + tableName);
        else
            return this.emit_NAME(tableName);
    }


    emit_NAME(name: string): string {

        if (this.dialect === "mssql")
            return "[" + name + "]";
        else if (this.dialect === "postgres")
            return "\"" + name + "\"";
        else if (this.dialect === "mysql")
            return "`" + name + "`";
        else {
            let msg = "invalid sql dialect " + this.dialect;
            throwError( msg + ", " + __filename);
            throw "fake";

        }

    }

    emit_STRING(value: string): string {
        if (value === null)
            return this.emit_NULL();
        else {
            if (this.dialect === "mssql")
                return "N'" + this.mssql_escape_string(value) + "'";
            else if (this.dialect === "postgres")
                return "'" + this.postgres_escape_string(value) + "'";
            else if (this.dialect === "mysql")
                return "'" + this.mysql_escape_string(value) + "'";
            else {
                let msg = "invalid sql dialect " + this.dialect;
                throwError( msg + ", " + __filename);
                throw "fake";

            }
        }
    }


    uuidToBytes(uuid: string) {
        let bytes: any[] = [];
        uuid.replace(/[a-fA-F0-9]{2}/g, function (hex) {
            bytes.push(parseInt(hex, 16));
            return "fake";
        });

        return bytes;
    }

    emit_GUID(value: Guid): string {

        if (this.dialect === "mssql")
            return "CONVERT(UNIQUEIDENTIFIER,'" + guidToHex(value) + "')";
        else if (this.dialect === "postgres")
            return "UUID '" + guidToHex(value) + "'";
        else if (this.dialect === "mysql")
            return "convert(0x" + arrayToHexString(new Uint8Array(value.buffer)) + ",binary(16))";
        else {
            let msg = "invalid sql dialect " + this.dialect;
            throwError( msg + ", " + __filename);
            throw "fake";

        }
    }

    emit_BOOLEAN(value: boolean): string {

        if (this.dialect === "mssql")
            return value === true ? "1" : "0";
        else if (this.dialect === "postgres")
            return value === true ? "TRUE" : "FALSE";
        else if (this.dialect === "mysql")
            return value === true ? "1" : "0";
        else {
            let msg = "invalid sql dialect " + this.dialect;
            throwError( msg + ", " + __filename);
            throw "fake";

        }
    }

    emit_BLOB(value: ArrayBuffer): string {

        if (this.dialect === "mssql")
            return "0x" + this.emit_HEX(Array.from(new Uint8Array(value)));
        else if (this.dialect === "postgres")
            return "E'\\\\x" + this.emit_HEX(Array.from(new Uint8Array(value))) + "'";
        else if (this.dialect === "mysql")
            return "convert(X'" + this.emit_HEX(Array.from(new Uint8Array(value))) + "',binary)";
        else {
            let msg = "invalid sql dialect " + this.dialect;
            throwError( msg + ", " + __filename);
            throw "fake";

        }
    }

    emit_DATETIME(value: Moment): string {
        if (this.dialect === "mssql")
            return "CONVERT(DATETIME2,'" + value.format("YYYYMMDD HH:mm:ss.SSS") + "')";
        else if (this.dialect === "postgres")
            return "TIMESTAMP(3)'" + value.format("YYYY-MM-DD HH:mm:ss.SSS") + "'";
        else if (this.dialect === "mysql")
        // timezone не воспринимает
            return "STR_TO_DATE('" + value.format("YYYY-MM-DD HH:mm:ss.SSS") + "','%Y-%c-%d %k:%i:%s.%f')";
        else {
            let msg = "invalid sql dialect " + this.dialect;
            throwError( msg + ", " + __filename);
            throw "fake";
        }

    }

    emit_DATE(value: Moment): string {
        if (this.dialect === "mssql")
            return "CONVERT(DATE,'" + value.format("YYYYMMDD") + "')";
        else if (this.dialect === "postgres")
            return "TIMESTAMP(3)'" + value.format("YYYY-MM-DD") + "'";
        else if (this.dialect === "mysql")
        // timezone не воспринимает
            return "STR_TO_DATE('" + value.format("YYYY-MM-DD") + "','%Y-%c-%d')";
        else {
            let msg = "invalid sql dialect " + this.dialect;
            throwError( msg + ", " + __filename);
            throw "fake";
        }

    }

    // isNumericDataType(dataType: _SqlDataType) {
    //     return (
    //         dataType === "byte" ||
    //         dataType === "sbyte" ||
    //         dataType === "short" ||
    //         dataType === "ushort" ||
    //         dataType === "int" ||
    //         dataType === "uint" ||
    //         dataType === "long" ||
    //         dataType === "ulong" ||
    //         dataType === "float" ||
    //         dataType === "double" ||
    //         dataType === "decimal"
    //     );
    // }

    // valueToSql(column: _ISqlTableColumn, value: any): string {
    //     if (this.isNumericDataType(column.dataType)) {
    //         if (isNumber(value))
    //             return value.toString();
    //         else
    //             return Number.parseFloat(value.toString()).toString();
    //     }
    //     if (column.dataType === "string" || column.dataType === "text") {
    //         return this.stringToSql(value.toString());
    //     }
    //     else if (column.dataType === "datetime") {
    //         if (isDate(value)) {
    //             return this.datetimeToSql(value);
    //         }
    //         else {
    //             return this.datetimeToSql(new Date(value.toString()));
    //         }
    //     }
    //     else if (column.dataType === "date") {
    //         if (isDate(value)) {
    //             return this.dateToSql(value);
    //         }
    //         else {
    //             return this.dateToSql(new Date(value.toString()));
    //         }
    //     }
    //     else {
    //         let msg = "invalid dataType " + column.dataType;
    //         console.error(msg);
    //         throw msg + ", " + __filename;
    //     }
    // }

    toSql(): string {
        return "";
    }

}

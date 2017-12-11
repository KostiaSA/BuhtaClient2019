import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {ComboBox} from "../../../ui/inputs/ComboBox";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isIntegerOrNull} from "../../../utils/isIntegerOrNull";

let CONST = require("numeric-constants");

export interface IIntegerSqlDataTypeProps extends IBaseSqlDataTypeProps {
    size?: "8" | "16" | "32" | "64";
    unsigned?: boolean;
    autoIncrement?: boolean;
}

export class IntegerSqlDataType extends BaseSqlDataType<IIntegerSqlDataTypeProps> {

    public static id = "Integer";

    getPropsNames(): string[] {
        return [...super.getPropsNames(), "size", "unsigned", "autoIncrement"];
    }

    setDefaultProps(props: IIntegerSqlDataTypeProps) {
        props.size = props.size || "32";
    }

    getName(props?: IIntegerSqlDataTypeProps): string {
        if (!props)
            return "Целое";
        else {
            return (props.unsigned ? "+" : "") + this.getName() + props.size + (props.autoIncrement ? ", autoInc" : "")
        }
    }

    getValidator(): Joi.ObjectSchema {
        return super.getValidator().keys({
            size: Joi.string().only(["8", "16", "32", "64"]).label("размерность"),
            unsigned: Joi.boolean().label("беззнаковое"),
            autoIncrement: Joi.boolean().label("автонумерация"),

        })
    };

    renderPropsEditors(props: IIntegerSqlDataTypeProps): React.ReactNode {
        //return ()<Input title="макс. длина" bindProp="dataType.maxLen" placeHolder="макс. длина" width={100}/>
        this.setDefaultProps(props);
        return (
            <ComboBox
                title="размерность"
                width={80}
                bindProp="dataType.size"
                placeHolder="размерность"
                displayMember="d"
                valueMember="v"
                source={[{v: "8", d: "8bit"}, {v: "16", d: "16bit"}, {v: "32", d: "32bit"}, {v: "64", d: "64bit"}]}
                hidden={props.id !== IntegerSqlDataType.id}
            />

        )
    }

    // todo autoincrement
    emitColumnDataType(dialect: SqlDialect, col: IIntegerSqlDataTypeProps): string {
        if (dialect === "mssql") {
            if (col.unsigned) {
                switch (col.size) {
                    case "8":
                        return ("TINYINT");
                    case "16":
                        return ("INT");
                    case "32":
                        return ("BIGINT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
            else {
                switch (col.size) {
                    case "8":
                        return ("SMALLINT");
                    case "16":
                        return ("SMALLINT");
                    case "32":
                        return ("INT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
        }
        else if (dialect === "postgres") {
            if (col.unsigned) {
                switch (col.size) {
                    case "8":
                        return ("SMALLINT");
                    case "16":
                        return ("INT");
                    case "32":
                        return ("BIGINT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
            else {
                switch (col.size) {
                    case "8":
                        return ("SMALLINT");
                    case "16":
                        return ("SMALLINT");
                    case "32":
                        return ("INT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
        }
        else if (dialect === "mysql") {
            if (col.unsigned) {
                switch (col.size) {
                    case "8":
                        return ("TINYINT UNSIGNED");
                    case "16":
                        return ("SMALLINT UNSIGNED");
                    case "32":
                        return ("INT UNSIGNED");
                    case "64":
                        return ("BIGINT UNSIGNED");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
            else {
                switch (col.size) {
                    case "8":
                        return ("TINYINT");
                    case "16":
                        return ("SMALLINT");
                    case "32":
                        return ("INT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
        }
        else {
            let msg = "IntegerSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            console.error(msg);
            throw msg + ", " + __filename;
        }

    }

    emitValue(dialect: SqlDialect, colDataType: IIntegerSqlDataTypeProps, value: any): string {
        if (!isIntegerOrNull(value))
            throw  "значение (" + value + ") должно быть целое число или null";

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        if (colDataType.unsigned) {
            switch (colDataType.size) {
                case "8":
                    if (value < 0 || value > CONST.MAX_UINT8)
                        throw "значение (" + value + ") должно быть целое число от 0 до " + CONST.MAX_UINT8;
                    break;
                case "16":
                    if (value < 0 || value > CONST.MAX_UINT16)
                        throw "значение (" + value + ") должно быть целое число от 0 до " + CONST.MAX_UINT16;
                    break;
                case "32":
                    if (value < 0 || value > CONST.MAX_UINT32)
                        throw "значение (" + value + ") должно быть целое число от 0 до " + CONST.MAX_UINT32;
                case "64":
                    if (value < 0 || value > CONST.MAX_SAFE_INTEGER_FLOAT64)
                        throw "значение (" + value + ") должно быть целое число от 0 до " + CONST.MAX_SAFE_INTEGER_FLOAT64;
                    break;
                default:
                    throw "invalid col.size " + colDataType.size;
            }
        }
        else {
            switch (colDataType.size) {
                case "8":
                    if (value < CONST.MIN_INT8 || value > CONST.MAX_INT8)
                        throw "значение (" + value + ") должно быть целое число от " + CONST.MIN_INT8 + " до " + CONST.MAX_INT8;
                    break;
                case "16":
                    if (value < CONST.MIN_INT16 || value > CONST.MAX_INT16)
                        throw "значение (" + value + ") должно быть целое число от " + CONST.MIN_INT16 + " до " + CONST.MAX_INT16;
                    break;
                case "32":
                    if (value < CONST.MIN_INT32 || value > CONST.MAX_INT32)
                        throw "значение (" + value + ") должно быть целое число от " + CONST.MIN_INT32 + " до " + CONST.MAX_INT32;
                    break;
                case "64":
                    if (value < CONST.MIN_SAFE_INTEGER_FLOAT64 || value > CONST.MAX_SAFE_INTEGER_FLOAT64)
                        throw "значение (" + value + ") должно быть целое число от " + CONST.MIN_SAFE_INTEGER_FLOAT64 + " до " + CONST.MAX_SAFE_INTEGER_FLOAT64;
                    break;
                default:
                    throw "invalid col.size " + colDataType.size;
            }
        }
        return value.toString();

    }

}
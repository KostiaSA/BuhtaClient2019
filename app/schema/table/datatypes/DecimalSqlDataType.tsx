import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {ComboBox} from "../../../ui/inputs/ComboBox";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isDecimalOrNull} from "../../../utils/isDecimalOrNull";
import {config} from "../../../config";

let CONST = require("numeric-constants");

export const DecimalScale: string[] = [
    "9,1",
    "9,2",
    "9,3",
    "9,4",
    "9,5",
    "9,6",
    "9,7",
    "16,1",
    "16,2",
    "16,3",
    "16,4",
    "16,5",
    "16,6",
    "16,7",
    "16,8",
    "16,9",
    "16,10",
    "16,11",
    "16,12",
    "16,13",
    "16,14"
];

export interface IDecimalSqlDataTypeProps extends IBaseSqlDataTypeProps {
    scale?: string;
}

export class DecimalSqlDataType extends BaseSqlDataType<IDecimalSqlDataTypeProps> {

    public static id = "Decimal";

    getPropsNames(): string[] {
        return [...super.getPropsNames(), "scale"];
    }

    setDefaultProps(props: IDecimalSqlDataTypeProps) {
        props.scale = props.scale || "16,4";
    }

    getName(props?: IDecimalSqlDataTypeProps): string {
        if (!props)
            return "Дробное";
        else {
            return this.getName() + "(" + props.scale + ")";
        }
    }

    getValidator(): Joi.ObjectSchema {
        return super.getValidator().keys({
            scale: Joi.string().only(DecimalScale).label("размерность"),
        })
    };

    renderPropsEditors(props: IDecimalSqlDataTypeProps): React.ReactNode {
        this.setDefaultProps(props);
        return (
            <ComboBox
                title="размерность"
                width={100}
                bindProp="dataType.scale"
                placeHolder="размерность"
                source={DecimalScale}
                hidden={props.id !== DecimalSqlDataType.id}
            />

        )
    }

    async emitColumnDataType(dialect: SqlDialect, col: IDecimalSqlDataTypeProps): Promise<string> {
        if (dialect === "mssql") {
            return "DECIMAL(" + col.scale + ")";
        }
        else if (dialect === "postgres") {
            return "NUMERIC(" + col.scale + ")";
        }
        else if (dialect === "mysql") {
            return "DECIMAL(" + col.scale + ")";
        }
        else {
            let msg = "DecimalSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            console.error(msg);
            throw msg + ", " + __filename;
        }

    }

    async emitValue(dialect: SqlDialect, colDataType: IDecimalSqlDataTypeProps, value: any): Promise<string> {
        if (!isDecimalOrNull(value))
            throw  "дробное значение (" + value + ") должно быть целое число или null";

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        let maxValue = config.sql.maxDecimal[colDataType.scale!];
        let minValue = -maxValue;

        if (value < minValue || value > maxValue)
            throw  "дробное значение (" + value + ") должно быть в интервале от " + minValue + " до " + maxValue;

        let maxDigits = parseInt(colDataType.scale!.split(",")[1]);
        let a = value.toString().split(".");
        if (a[1] && a[1].length > maxDigits)
            throw  "дробное значение (" + value + ") должно иметь не более " + maxDigits + "-х цифр после запятой";

        return value.toString();

    }

}
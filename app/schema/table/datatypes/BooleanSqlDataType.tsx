import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {NumberInput} from "../../../ui/inputs/NumberInput";
import {config} from "../../../config";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isStringOrNull} from "../../../utils/isStringOrNull";
import {isBooleanOrNull} from "../../../utils/isBooleanOrNull";



export interface IBooleanSqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class BooleanSqlDataType extends BaseSqlDataType<IBooleanSqlDataTypeProps> {

    public static id = "Boolean";

    getName(props?: IBooleanSqlDataTypeProps): string {
        return "Да/Нет (boolean)";
    }

    // getPropsNames(): string[] {
    //     return [...super.getPropsNames()];
    // }
    //
    // setDefaultProps(props: IBooleanSqlDataTypeProps) {
    //
    // }

    // getValidator(): Joi.ObjectSchema {
    //     return super.getValidator().keys({
    //         maxLen: Joi.number().integer().min(0).max(config.sql.maxStringLength).label("макс. длина"),
    //     })
    // };

    // renderPropsEditors(props: IBooleanSqlDataTypeProps): React.ReactNode {
    //     this.setDefaultProps(props);
    //     return (
    //         <NumberInput
    //             title="макс. длина"
    //             bindProp="dataType.maxLen"
    //             width={100}
    //             decimalDigits={0}
    //             hidden={props.id !== BooleanSqlDataType.id}
    //             resizable storageKey="input:SchemaTableColumn.dataType.maxLen"
    //         />
    //     )
    // }


    emitColumnDataType(dialect: SqlDialect, col: IBooleanSqlDataTypeProps): string {
        if (dialect === "mssql") {
           return ("BIT");
        }
        else if (dialect === "postgres") {
            return ("boolean");
        }
        else if (dialect === "mysql") {
            return ("BIT");
        }
        else {
            let msg = "BooleanSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            console.error(msg);
            throw msg;
        }

    }

    emitValue(dialect: SqlDialect, colDataType: IBooleanSqlDataTypeProps, value: any): string {
        if (!isBooleanOrNull(value))
            throw  "значение должно быть true/false или null";

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        return new SqlEmitter(dialect).emit_BOOLEAN(value);

    }

}
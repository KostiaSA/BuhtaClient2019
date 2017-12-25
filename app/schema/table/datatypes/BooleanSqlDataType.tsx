import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {config} from "../../../config";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isBooleanOrNull} from "../../../utils/isBooleanOrNull";
import {throwError} from "../../../utils/throwError";


export interface IBooleanSqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class BooleanSqlDataType extends BaseSqlDataType<IBooleanSqlDataTypeProps> {

    public static id = "Boolean";

    getName(props?: IBooleanSqlDataTypeProps): string {
        return "Да/Нет (boolean)";
    }

    getDesignerColor(): string {
        return config.sql.booleanDataTypeColor;
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


    async emitColumnDataType(dialect: SqlDialect, col: IBooleanSqlDataTypeProps): Promise<string> {
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
            throwError(msg);
            throw "fake";
        }

    }

    async emitValue(dialect: SqlDialect, colDataType: IBooleanSqlDataTypeProps, value: any): Promise<string> {
        if (!isBooleanOrNull(value))
            throwError("значение должно быть true/false или null");

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        return new SqlEmitter(dialect).emit_BOOLEAN(value);

    }

    isEquals(value1: any, value2: any): boolean {

        if (value1 === value2)
            return true;

        if ((value1 === undefined || value1 === null || value1 === false ) && (value2 === undefined || value2 === null || value2 === false))
            return true;

        return false;

    }

}
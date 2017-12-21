import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isMoneyOrNull} from "../../../utils/isMoneyOrNull";
import {config} from "../../../config";
import {throwError} from "../../../utils/throwError";

declare let TextEncoder: any;


export interface IMoneySqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class MoneySqlDataType extends BaseSqlDataType<IMoneySqlDataTypeProps> {

    public static id = "Money";

    getName(props?: IMoneySqlDataTypeProps): string {
        return "Деньги";
    }

    getDesignerColor(): string {
        return config.sql.moneyDataTypeColor;
    }

    // getPropsNames(): string[] {
    //     return [...super.getPropsNames()];
    // }
    //
    // setDefaultProps(props: IMoneySqlDataTypeProps) {
    //
    // }

    // getValidator(): Joi.ObjectSchema {
    //     return super.getValidator().keys({
    //         maxLen: Joi.number().integer().min(0).max(config.sql.maxStringLength).label("макс. длина"),
    //     })
    // };

    // renderPropsEditors(props: IMoneySqlDataTypeProps): React.ReactNode {
    //     this.setDefaultProps(props);
    //     return (
    //         <NumberInput
    //             title="макс. длина"
    //             bindProp="dataType.maxLen"
    //             width={100}
    //             decimalDigits={0}
    //             hidden={props.id !== MoneySqlDataType.id}
    //             resizable storageKey="input:SchemaTableColumn.dataType.maxLen"
    //         />
    //     )
    // }


    async emitColumnDataType(dialect: SqlDialect, col: IMoneySqlDataTypeProps): Promise<string> {
        if (dialect === "mssql") {
            return ("DECIMAL(16,2)");
        }
        else if (dialect === "postgres") {
            return ("NUMERIC(16,2)");
        }
        else if (dialect === "mysql") {
            return ("DECIMAL(16,2)");
        }
        else {
            let msg = "MoneySqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            throwError( msg);
            throw "fake";
        }
    }

    async emitValue(dialect: SqlDialect, colDataType: IMoneySqlDataTypeProps, value: any): Promise<string> {
        if (!isMoneyOrNull(value))
            throwError(  "значение 'деньги' должно быть числом или null");

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        if (value > config.sql.maxMoneyValue)
            throwError(  "значение 'деньги' (" + value + ") должно быть меньше " + config.sql.maxMoneyValue.toString());

        if (value < config.sql.minMoneyValue)
            throwError(  "значение 'деньги' (" + value + ") должно быть больше " + config.sql.minMoneyValue.toString());

        let a = value.toString().split(".");
        if (a[1] && a[1].length > 2)
            throwError(  "значение 'деньги' (" + value + ") должно иметь не более 2-х цифр после запятой");



        return value.toString();

    }

}
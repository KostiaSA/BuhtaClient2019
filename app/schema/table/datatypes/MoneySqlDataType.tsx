import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isMoneyOrNull} from "../../../utils/isMoneyOrNull";
import {config} from "../../../config";

declare let TextEncoder: any;


export interface IMoneySqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class MoneySqlDataType extends BaseSqlDataType<IMoneySqlDataTypeProps> {

    public static id = "Money";

    getName(props?: IMoneySqlDataTypeProps): string {
        return "Деньги";
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


    emitColumnDataType(dialect: SqlDialect, col: IMoneySqlDataTypeProps): string {
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
            console.error(msg);
            throw msg;
        }

    }

    emitValue(dialect: SqlDialect, colDataType: IMoneySqlDataTypeProps, value: any): string {
        if (!isMoneyOrNull(value))
            throw  "значение 'деньги' должно быть числом или null";

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        if (value > config.sql.maxMoneyValue)
            throw  "значение 'деньги' (" + value + ") должно быть меньше " + config.sql.maxMoneyValue.toString();

        if (value < config.sql.minMoneyValue)
            throw  "значение 'деньги' (" + value + ") должно быть больше " + config.sql.minMoneyValue.toString();

        let a = value.toString().split(".");
        if (a[1] && a[1].length > 2)
            throw  "значение 'деньги' (" + value + ") должно иметь не более 2-х цифр после запятой";



        return value.toString();

    }

}
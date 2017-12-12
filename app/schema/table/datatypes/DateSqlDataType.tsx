import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {NumberInput} from "../../../ui/inputs/NumberInput";
import {config} from "../../../config";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isStringOrNull} from "../../../utils/isStringOrNull";
import {isDateOrNull} from "../../../utils/isDateOrNull";
import {Moment} from "moment";

declare let TextEncoder: any;


export interface IDateSqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class DateSqlDataType extends BaseSqlDataType<IDateSqlDataTypeProps> {

    public static id = "Date";

    getName(props?: IDateSqlDataTypeProps): string {
        return "Дата";
    }


    emitColumnDataType(dialect: SqlDialect, col: IDateSqlDataTypeProps): string {
        if (dialect === "mssql") {
           return ("DATE");
        }
        else if (dialect === "postgres") {
            return ("DATE");
        }
        else if (dialect === "mysql") {
            return ("DATE");
        }
        else {
            let msg = "DateSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            console.error(msg);
            throw msg;
        }

    }

    emitValue(dialect: SqlDialect, colDataType: IDateSqlDataTypeProps, date: Moment): string {
        if (!isDateOrNull(date))
            throw  "значение даты должно быть объектом типа Moment или null";

        if (date === null)
            return new SqlEmitter(dialect).emit_NULL();

        if (date.isBefore(config.sql.minDate) || date.isAfter(config.sql.maxDate))
            throw  "значение даты должно быть в пределах '1 янв 0001 г' и '31 дек 9999 г'";


        return new SqlEmitter(dialect).emit_DATE(date);

    }

}
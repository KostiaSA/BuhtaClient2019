import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {config} from "../../../config";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isDateOrNull} from "../../../utils/isDateOrNull";
import {Moment} from "moment";
import {throwError} from "../../../utils/throwError";
import {isDate} from "../../../utils/isDate";

declare let TextEncoder: any;


export interface IDateSqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class DateSqlDataType extends BaseSqlDataType<IDateSqlDataTypeProps> {

    public static id = "Date";

    getName(props?: IDateSqlDataTypeProps): string {
        return "Дата";
    }

    getDesignerColor(): string {
        return config.sql.dateDataTypeColor;
    }

    async emitColumnDataType(dialect: SqlDialect, col: IDateSqlDataTypeProps): Promise<string> {
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
            throwError(msg);
            throw "fake";

        }

    }

    async emitValue(dialect: SqlDialect, colDataType: IDateSqlDataTypeProps, date: Moment): Promise<string> {
        if (!isDateOrNull(date))
            throwError("значение даты должно быть объектом типа Moment или null");

        if (date === null)
            return new SqlEmitter(dialect).emit_NULL();

        if (date.isBefore(config.sql.minDate) || date.isAfter(config.sql.maxDate))
            throwError("значение даты должно быть в пределах '2 янв 0001 г' и '31 дек 9999 г'");


        return new SqlEmitter(dialect).emit_DATE(date);

    }

    isEquals(value1: any, value2: any): boolean {

        if (value1 === value2)
            return true;

        if ((value1 === undefined || value1 === null ) && (value2 === undefined || value2 === null))
            return true;

        if (isDate(value1) && isDate(value2)) {
            return (value1 as Moment).isSame(value2);
        }

        return false;

    }

}
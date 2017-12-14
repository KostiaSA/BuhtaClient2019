import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {NumberInput} from "../../../ui/inputs/NumberInput";
import {config} from "../../../config";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isDateOrNull} from "../../../utils/isDateOrNull";
import {Moment} from "moment";


export interface IDateTimeSqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class DateTimeSqlDataType extends BaseSqlDataType<IDateTimeSqlDataTypeProps> {

    public static id = "DateTime";

    getName(props?: IDateTimeSqlDataTypeProps): string {
        return "ДатаВремя";
    }


    async emitColumnDataType(dialect: SqlDialect, col: IDateTimeSqlDataTypeProps): Promise<string> {
        if (dialect === "mssql") {
           return ("DATETIME2");
        }
        else if (dialect === "postgres") {
            return ("TIMESTAMP");
        }
        else if (dialect === "mysql") {
            return ("DATETIME(3)");
        }
        else {
            let msg = "DateTimeSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            console.error(msg);
            throw msg;
        }

    }

    async emitValue(dialect: SqlDialect, colDataType: IDateTimeSqlDataTypeProps, date: Moment): Promise<string> {
        if (!isDateOrNull(date))
            throw  "значение ДатаВремя должно быть объектом типа Moment или null";

        if (date === null)
            return new SqlEmitter(dialect).emit_NULL();

        if (date.isBefore(config.sql.minDateTime) || date.isAfter(config.sql.maxDateTime))
            throw  "значение ДатаВремя должно быть в пределах '2 янв 0001 г, 00:00:00.001' и '31 дек 9999 г, 23:59:59.999'";


        return new SqlEmitter(dialect).emit_DATETIME(date);

    }

}
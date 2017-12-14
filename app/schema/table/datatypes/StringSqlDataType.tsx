import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {NumberInput} from "../../../ui/inputs/NumberInput";
import {config} from "../../../config";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isStringOrNull} from "../../../utils/isStringOrNull";
import {isString} from "../../../utils/isString";

declare let TextEncoder: any;


export interface IStringSqlDataTypeProps extends IBaseSqlDataTypeProps {
    maxLen?: number;
}

export class StringSqlDataType extends BaseSqlDataType<IStringSqlDataTypeProps> {

    public static id = "String";

    getName(props?: IStringSqlDataTypeProps): string {
        if (!props)
            return "Строка";
        else {
            let maxLenStr = "(MAX)";

            if (props.maxLen && props.maxLen > 0)
                maxLenStr = "(" + props.maxLen + ")";

            return this.getName() + maxLenStr;

        }
    }

    getPropsNames(): string[] {
        return [...super.getPropsNames(), "maxLen"];
    }

    setDefaultProps(props: IStringSqlDataTypeProps) {
        props.maxLen = props.maxLen || 50;
    }

    getValidator(): Joi.ObjectSchema {
        return super.getValidator().keys({
            maxLen: Joi.number().integer().min(0).max(config.sql.maxStringLength).label("макс. длина"),
        })
    };

    renderPropsEditors(props: IStringSqlDataTypeProps): React.ReactNode {
        this.setDefaultProps(props);
        return (
            <NumberInput
                title="макс. длина"
                bindProp="dataType.maxLen"
                width={100}
                decimalDigits={0}
                hidden={props.id !== StringSqlDataType.id}
                resizable storageKey="input:SchemaTableColumn.dataType.maxLen"
            />
        )
    }

    dataTypeUserFriendly(props: IStringSqlDataTypeProps, parentReactComp: React.ReactElement<any>): React.ReactNode {
        let maxLenStr = "(MAX)";

        if (props.maxLen && props.maxLen > 0)
            maxLenStr = "(" + props.maxLen + ")";

        return (
            <span
                style={{color: "indianred"}}>{this.getName() + maxLenStr}
            </span>
        );
    }

    async emitColumnDataType(dialect: SqlDialect, col: IStringSqlDataTypeProps): Promise<string> {
        let maxLen: any = col.maxLen;
        if (isString(maxLen))
            maxLen = parseInt(maxLen);

        if (dialect === "mssql") {
            if (!maxLen || maxLen <= 0)
                return (`NVARCHAR(MAX)`);
            else
                return (`NVARCHAR(${maxLen})`);
        }
        else if (dialect === "postgres") {
            if (!maxLen || maxLen <= 0)
                return (`TEXT`);
            else
                return (`VARCHAR(${maxLen})`);
        }
        else if (dialect === "mysql") {
            if (!maxLen || maxLen <= 0)
                return (`LONGTEXT`);
            else
                return (`VARCHAR(${maxLen})`);
        }
        else {
            let msg = "StringSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            console.error(msg);
            throw msg + ", " + __filename;
        }

    }

    async emitValue(dialect: SqlDialect, colDataType: IStringSqlDataTypeProps, value: any): Promise<string> {
        if (!isStringOrNull(value))
            throw  "значение должно быть строкой или null";

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        if (colDataType.maxLen && colDataType.maxLen > 0) {
            if (value.length > colDataType.maxLen) {
                throw "длина строки превышает " + colDataType.maxLen;
            }
        }

        return new SqlEmitter(dialect).emit_STRING(value);

    }

}
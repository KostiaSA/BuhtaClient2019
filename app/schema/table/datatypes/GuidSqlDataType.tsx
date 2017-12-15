import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {NumberInput} from "../../../ui/inputs/NumberInput";
import {config} from "../../../config";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isStringOrNull} from "../../../utils/isStringOrNull";
import {isGuidOrNull} from "../../../utils/isGuidOrNull";

declare let TextEncoder: any;


export interface IGuidSqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class GuidSqlDataType extends BaseSqlDataType<IGuidSqlDataTypeProps> {

    public static id = "Guid";

    getName(props?: IGuidSqlDataTypeProps): string {
        return "Guid";
    }

    getDesignerColor(): string {
        return config.sql.guidDataTypeColor;

    }

    // getPropsNames(): string[] {
    //     return [...super.getPropsNames()];
    // }
    //
    // setDefaultProps(props: IGuidSqlDataTypeProps) {
    //
    // }

    // getValidator(): Joi.ObjectSchema {
    //     return super.getValidator().keys({
    //         maxLen: Joi.number().integer().min(0).max(config.sql.maxStringLength).label("макс. длина"),
    //     })
    // };

    // renderPropsEditors(props: IGuidSqlDataTypeProps): React.ReactNode {
    //     this.setDefaultProps(props);
    //     return (
    //         <NumberInput
    //             title="макс. длина"
    //             bindProp="dataType.maxLen"
    //             width={100}
    //             decimalDigits={0}
    //             hidden={props.id !== GuidSqlDataType.id}
    //             resizable storageKey="input:SchemaTableColumn.dataType.maxLen"
    //         />
    //     )
    // }


    async emitColumnDataType(dialect: SqlDialect, col: IGuidSqlDataTypeProps): Promise<string> {
        if (dialect === "mssql") {
           return ("UNIQUEIDENTIFIER");
        }
        else if (dialect === "postgres") {
            return ("UUID");
        }
        else if (dialect === "mysql") {
            return ("BINARY(16)");
        }
        else {
            let msg = "GuidSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            console.error(msg);
            throw msg;
        }

    }

    async emitValue(dialect: SqlDialect, colDataType: IGuidSqlDataTypeProps, value: any): Promise<string> {
        if (!isGuidOrNull(value))
            throw  "значение должно быть guid-строкой или null";

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        return new SqlEmitter(dialect).emit_GUID(value);

    }

}
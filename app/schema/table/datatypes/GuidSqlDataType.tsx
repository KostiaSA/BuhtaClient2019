import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {config} from "../../../config";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {Guid, isGuid, isGuidOrNull, isGuidsEqual} from "../../../utils/guid";
import {throwError} from "../../../utils/throwError";

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
            throwError(msg);
            throw "fake";

        }

    }

    async emitValue(dialect: SqlDialect, colDataType: IGuidSqlDataTypeProps, value: Guid): Promise<string> {
        if (!isGuidOrNull(value))
            throwError("значение должно быть Guid или null");

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        return new SqlEmitter(dialect).emit_GUID(value);

    }

    isEquals(value1: any, value2: any): boolean {

        if (value1 === value2)
            return true;

        if ((value1 === undefined || value1 === null ) && (value2 === undefined || value2 === null))
            return true;

        if (isGuid(value1) && isGuid(value2)) {
            return isGuidsEqual(value1,value2);
        }

        return false;

    }

}
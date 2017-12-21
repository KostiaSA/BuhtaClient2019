import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isBlobOrNull} from "../../../utils/isBlobOrNull";
import {config} from "../../../config";
import {throwError} from "../../../utils/throwError";

declare let TextEncoder: any;


export interface IBlobSqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class BlobSqlDataType extends BaseSqlDataType<IBlobSqlDataTypeProps> {

    public static id = "Blob";

    getName(props?: IBlobSqlDataTypeProps): string {
        return "Image/BLOB";
    }

    getDesignerColor(): string {
        return config.sql.blobDataTypeColor;
    }

    // getPropsNames(): string[] {
    //     return [...super.getPropsNames()];
    // }
    //
    // setDefaultProps(props: IBlobSqlDataTypeProps) {
    //
    // }

    // getValidator(): Joi.ObjectSchema {
    //     return super.getValidator().keys({
    //         maxLen: Joi.number().integer().min(0).max(config.sql.maxStringLength).label("макс. длина"),
    //     })
    // };

    // renderPropsEditors(props: IBlobSqlDataTypeProps): React.ReactNode {
    //     this.setDefaultProps(props);
    //     return (
    //         <NumberInput
    //             title="макс. длина"
    //             bindProp="dataType.maxLen"
    //             width={100}
    //             decimalDigits={0}
    //             hidden={props.id !== BlobSqlDataType.id}
    //             resizable storageKey="input:SchemaTableColumn.dataType.maxLen"
    //         />
    //     )
    // }


    async emitColumnDataType(dialect: SqlDialect, col: IBlobSqlDataTypeProps): Promise<string> {
        if (dialect === "mssql") {
            return ("IMAGE");
        }
        else if (dialect === "postgres") {
            return ("BYTEA");
        }
        else if (dialect === "mysql") {
            return ("LONGBLOB");
        }
        else {
            let msg = "BlobSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            throwError( msg);
            throw "fake";

        }

    }

    async emitValue(dialect: SqlDialect, colDataType: IBlobSqlDataTypeProps, value: ArrayBuffer): Promise<string> {
        if (!isBlobOrNull(value))
            throwError(  "значение должно быть ArrayBuffer или null");

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        return new SqlEmitter(dialect).emit_BLOB(value);
        //return "0x" + new SqlEmitter(dialect).emit_HEX(Array.from(new Uint8Array(value)));
    }

}
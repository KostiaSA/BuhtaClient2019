import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {SqlDialect, SqlEmitter} from "../../../sql/SqlEmitter";
import {isBlobOrNull} from "../../../utils/isBlobOrNull";

declare let TextEncoder: any;


export interface IBlobSqlDataTypeProps extends IBaseSqlDataTypeProps {

}

export class BlobSqlDataType extends BaseSqlDataType<IBlobSqlDataTypeProps> {

    public static id = "Blob";

    getName(props?: IBlobSqlDataTypeProps): string {
        return "Image/BLOB";
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


    emitColumnDataType(dialect: SqlDialect, col: IBlobSqlDataTypeProps): string {
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
            console.error(msg);
            throw msg;
        }

    }

    emitValue(dialect: SqlDialect, colDataType: IBlobSqlDataTypeProps, value: ArrayBuffer): string {
        if (!isBlobOrNull(value))
            throw  "значение должно быть ArrayBuffer или null";

        if (value === null)
            return new SqlEmitter(dialect).emit_NULL();

        return "0x" + new SqlEmitter(dialect).emit_HEX(new Uint8Array(value) as any);

    }

}
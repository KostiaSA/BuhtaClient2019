import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {config} from "../../../config";
import {ComboBox} from "../../../ui/inputs/ComboBox";
import {ISchemaTree, loadSchemaTree} from "../../../admin/api/loadSchemaTree";
import {removeJsonExt} from "../../../utils/removeJsonExt";
import {SqlDialect} from "../../../sql/SqlEmitter";
import {getSchemaObjectProps} from "../../getSchemaObjectProps";
import {ISchemaTableProps, SchemaTable} from "../SchemaTable";
import {appState} from "../../../AppState";

export interface IFkSqlDataTypeProps extends IBaseSqlDataTypeProps {
    fkTableId?: string;
}

export class FkSqlDataType extends BaseSqlDataType<IFkSqlDataTypeProps> {

    public static id = "ForeignKey";

    getName(props?: IFkSqlDataTypeProps): string {
        if (!props)
            return "Ссылка";
        else {
            return this.getName() + "->" + props.fkTableId;
        }
    }

    getPropsNames(): string[] {
        return [...super.getPropsNames(), "fkTableId"];
    }

    setDefaultProps(props: IFkSqlDataTypeProps) {

    }

    getValidator(): Joi.ObjectSchema {
        return super.getValidator().keys({
            fkTableId: Joi.string().max(config.sql.maxIdentifierLength).label("FK таблица"),
        })
    };

    schemaTreeToFlatArray(tree: ISchemaTree, a: string[], path: string): string[] {
        if (tree.items) {
            for (let item of tree.items) {
                this.schemaTreeToFlatArray(item, a, path + "/" + tree.name);
            }
        }
        else {
            let table = (path + "/" + tree.name).replace("/root/", "");
            a.push(removeJsonExt(table));
        }
        return a;
    }

    renderPropsEditors(props: IFkSqlDataTypeProps): React.ReactNode {
        this.setDefaultProps(props);
        return (
            <ComboBox
                title="FK таблица"
                bindProp="dataType.fkTableId"
                placeHolder=""
                width={450}
                hidden={props.id !== FkSqlDataType.id}
                source={async () => this.schemaTreeToFlatArray(await loadSchemaTree("", ["table"]), [], "")}
                resizable storageKey="input:SchemaTableColumn.dataType.fkTableId"
            />
        )
    }

    //getSchemaObjectProps
    async emitColumnDataType(dialect: SqlDialect, col: IFkSqlDataTypeProps): Promise<string> {

        let fkTableProps = await getSchemaObjectProps<ISchemaTableProps>(col.fkTableId!);
        let fkTable = new SchemaTable(fkTableProps);
        let fkCol = fkTable.getPrimaryKeyColumn();

        if (!fkCol)
            throw "у таблицы '" + fkTableProps.name + "' отсутствует первичный ключ, ссылка на таблицу невозможна";

        let dataType = appState.sqlDataTypes[fkCol.dataType.id];
        let dataTypeStr = dataType.emitColumnDataType(dialect, fkCol.dataType);

        return dataTypeStr;

        // this.props.columns.forEach((fkCol: ISchemaTableColumnProps, index: number) => {
        //     let dataType = appState.sqlDataTypes[fkCol.dataType.id];
        //     let dataTypeStr = dataType.emitColumnDataType(dialect, fkCol.dataType);
        //     let notNullStr = fkCol.notNull ? " NOT NULL" : "";
        //     let pkStr = fkCol.primaryKey ? " PRIMARY KEY" : "";
        //     colsSql.push("  " + e.emit_NAME(fkCol.name) + " " + dataTypeStr + notNullStr + pkStr);
        // });
        //
        // if (dialect === "mssql") {
        //     return ("UNIQUEIDENTIFIER");
        // }
        // else if (dialect === "postgres") {
        //     return ("UUID");
        // }
        // else if (dialect === "mysql") {
        //     return ("BINARY(16)");
        // }
        // else {
        //     let msg = "GuidSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
        //     console.error(msg);
        //     throw msg;
        // }

    }

    async emitValue(dialect: SqlDialect, colDataType: IFkSqlDataTypeProps, value: any): Promise<string> {

        let fkTableProps = await getSchemaObjectProps<ISchemaTableProps>(colDataType.fkTableId!);
        let fkTable = new SchemaTable(fkTableProps);
        let fkCol = fkTable.getPrimaryKeyColumn();

        if (!fkCol)
            throw "у таблицы '" + fkTableProps.name + "' отсутствует первичный ключ, ссылка на таблицу невозможна";

        let dataType = appState.sqlDataTypes[fkCol.dataType.id];

        return dataType.emitValue(dialect, fkCol.dataType, value);

    }

}
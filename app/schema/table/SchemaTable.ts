import * as Joi from "joi";
import {alternatives} from "joi";
import {ISchemaObjectProps, SchemaObject} from "../SchemaObject";
import {IBaseSqlDataTypeProps} from "./datatypes/BaseSqlDataType";
import {joiRus} from "../../i18n/joiRus";
import {appState} from "../../AppState";
import {config} from "../../config";
import {SchemaTableDesignerWindow} from "../../admin/SchemaTableDesignerWindow";
import {SqlBatch, SqlDialect, SqlEmitter} from "../../sql/SqlEmitter";
import {isArray} from "../../utils/isArray";


export interface ISchemaTableProps extends ISchemaObjectProps {
    sqlName?: string;
    columns: ISchemaTableColumnProps[];
    isTemp?: boolean;
    //  editOptions?: ISchemaTableEditOptions;
}

export interface ISchemaTableColumnProps {
    name: string;
    primaryKey?: boolean;
    description?: string;
    position?: number;
    notNull?: boolean,
    dataType: IBaseSqlDataTypeProps;

    //formInputOptions?: IFormInputOptions;
}


export class SchemaTable extends SchemaObject<ISchemaTableProps> { //implements ISchemaTableRow {

    constructor(props: ISchemaTableProps) {
        super(props);
    }

    static objectType = "table";
    static objectTypeName = "Таблица";
    static icon = "vendor/fugue/table.png";
    static designerWindow = SchemaTableDesignerWindow;

    getColumnValidator(): Joi.ObjectSchema {
        return Joi.object().options({language: joiRus}).keys({
            name: Joi.string().max(config.sql.maxIdentifierLength).required().label("имя"),
            primaryKey: Joi.boolean().label("первичный ключ"),
            description: Joi.string().max(config.sql.maxStringLength).label("описание"),
            notNull: Joi.boolean().label("not null"),
            dataType: alternatives(appState.sqlDataTypesAsArray.map((dt) => dt.getValidator())).label("тип данных"),
        })

    }

    getValidator(): Joi.ObjectSchema {
        return super.getValidator().keys({
            name: Joi.string().max(config.sql.maxIdentifierLength).required().label("имя таблицы"),
            sqlName: Joi.string().max(config.sql.maxIdentifierLength).label("sql-имя"),
            columns: Joi.array().items(this.getColumnValidator()).max(config.sql.maxColumnsInTable).min(1).label("колонки")
        })
    };


    getColumnByName(colName: string): ISchemaTableColumnProps | undefined {
        if (this.props.columns) {
            let index = this.props.columns.findIndex((col: any) => col.name === colName);
            return this.props.columns[index];
        }
        else
            return undefined;
    }

    getPrimaryKeyColumn(): ISchemaTableColumnProps | null {
        for (let col of this.props.columns) {
            if (col.primaryKey)
                return col;
        }
        return null;
    }

    // async openChangeRecordPage(recordId: string): Promise<void> {
    //
    //     if (SchemaTable.classInfo.editOptions && SchemaTable.classInfo.editOptions.editPageId) {
    //         let page = await SchemaHelper.createSchemaObject<SchemaPage>(SchemaTable.classInfo.editOptions.editPageId);
    //         page.openInNewTab({objectId: recordId});
    //     }
    //     else {
    //         let msg = "openChangeRecordPage для SchemaTable";
    //         console.error(msg);
    //         throw msg + ", " + __filename;
    //     }
    // }
    //
    // async handleChangeRecordClick(recordId: any) {
    //     console.log("handleChangeRecordClick(recordId: any)", recordId, this.props);
    //     if (isString(recordId)) {
    //
    //         let classInfo = appState.getRegisteredClassInfoByPrefix(recordId);
    //
    //         if (classInfo) {
    //             let objClass = classInfo.constructor;
    //             if (objClass) {
    //                 let obj = new objClass() as ISchemaTableRow;
    //                 if (obj.openChangeRecordPage) {
    //                     obj.openChangeRecordPage(recordId);
    //                 }
    //                 else {
    //                     alert("ошибка вызова редактора 555");
    //
    //                 }
    //             }
    //             else {
    //                 alert("ошибка вызова редактора 333");
    //
    //             }
    //         }
    //         else {
    //             alert("ошибка вызова редактора 000");
    //         }
    //
    //     }
    //     else {
    //         let pageId: string;
    //         if (this.props.editOptions && this.props.editOptions.editPageId)
    //             pageId = this.props.editOptions.editPageId;
    //         else
    //             pageId = SchemaPage.classInfo.recordIdPrefix + ":" + CoreConst.FormPageObjectId;
    //         let editPpage = await SchemaHelper.createSchemaObject<SchemaPage>(pageId);
    //
    //
    //         let formId: string = undefined as any;
    //         if (this.props.editOptions && this.props.editOptions.editFormId)
    //             formId = this.props.editOptions.editFormId;
    //
    //         let params: any = {
    //             objectId: recordId,
    //             tableId: this.props.id,
    //             dbId: SchemaDatabase.classInfo.recordIdPrefix + ":" + CoreConst.Schema_DatabaseId
    //         };
    //
    //         if (formId)
    //             params.formId = formId;
    //
    //         editPpage.openInNewTab(params);
    //
    //         // if (this.props.editOptions) {
    //         //     if (this.props.editOptions.editPageId) {
    //         //
    //         //         let editPpage = await SchemaHelper.createSchemaObject<SchemaPage>(this.props.editOptions.editPageId);
    //         //
    //         //         let params: any = {objectId: recordId};
    //         //         if (this.props.editOptions.editFormId)
    //         //             params.formId = this.props.editOptions.editFormId;
    //         //
    //         //         editPpage.openInNewTab(params);
    //         //     }
    //         //     else
    //         //         alert("ошибка вызова редактора 111");
    //         // }
    //         // else {
    //         //     alert("вызов стандартного редактора");
    //         //     let editPpage = await SchemaHelper.createSchemaObject<SchemaPage>(SchemaPage.classInfo.recordIdPrefix + ":" + CoreConst.FormPageObjectId);
    //         //     editPpage.openInNewTab({objectId: recordId});
    //         // }
    //
    //     }
    //
    // }
    //
    // async handleAddRecordClick() {
    //
    //     if (this.props.editOptions) {
    //         if (this.props.editOptions.addPageId) {
    //             let editPpage = await SchemaHelper.createSchemaObject<SchemaPage>(this.props.editOptions.addPageId);
    //             editPpage.openInNewTab();
    //         }
    //         else
    //             alert("ошибка вызова редактора 999");
    //     }
    //     else {
    //         alert("вызов стандартного редактора 999-00");
    //     }
    //
    // }
    //
    // async getRow(dbId: string, recordId: any): Promise<SchemaTableRow<any>> {
    //     let rowProps = (await tableGetRowApiRequest({dbId: dbId, tableId: this.props.id, recordId: recordId})).row;
    //     return new SchemaTableRow(dbId, this, rowProps);
    // }

    emitCreateTableSql(dialect: SqlDialect): SqlBatch {

        let e = new SqlEmitter(dialect);

        let sql: string[] = [];

        if (this.props.isTemp) {
            if (dialect === "mssql")
                sql.push("CREATE TABLE ");
            else if (dialect === "postgres")
                sql.push("CREATE TEMPORARY TABLE ");
            else if (dialect === "mysql")
                sql.push("CREATE TEMPORARY TABLE ");
            else {
                let msg = "emitCreateTableSql(): invalid sql dialect '" + dialect + "'";
                console.error(msg);
                throw msg + ", " + __filename;
            }

        }
        else
            sql.push("CREATE TABLE ");

        sql.push(e.emit_TABLE_NAME(this.props.sqlName || this.props.name));

        sql.push("(\n");

        let colsSql: string[] = [];
        this.props.columns.forEach((col: ISchemaTableColumnProps, index: number) => {
            let dataType = appState.sqlDataTypes[col.dataType.id];
            let dataTypeStr = dataType.emitColumnDataType(dialect, col.dataType);
            let notNullStr = col.notNull ? " NOT NULL" : "";
            let pkStr = col.primaryKey ? " PRIMARY KEY" : "";
            colsSql.push("  " + e.emit_NAME(col.name) + " " + dataTypeStr + notNullStr + pkStr);
        });
        sql.push(colsSql.join(",\n") + "\n");

        sql.push(")\n");

        return sql.join("");

    }

    emitDropTableSql(dialect: SqlDialect): SqlBatch {

        let e = new SqlEmitter(dialect);

        let sql: string[] = [];

        sql.push("DROP TABLE ");

        sql.push(e.emit_TABLE_NAME(this.props.sqlName || this.props.name));

        sql.push("\n");

        return sql.join("");

    }

    emitInsertRowSql(dialect: SqlDialect, row: any): SqlBatch {

        let e = new SqlEmitter(dialect);

        let sql: string[] = [];

        sql.push("INSERT INTO ");

        sql.push(e.emit_TABLE_NAME(this.props.sqlName || this.props.name));

        let colNames: string[] = [];
        let colValues: string[] = [];
        this.props.columns.forEach((col: ISchemaTableColumnProps, index: number) => {
            if (row[col.name] !== undefined) {
                if (row[col.name] !== null) {
                    let dataType = appState.sqlDataTypes[col.dataType.id];
                    colNames.push(e.emit_NAME(col.name));
                    try {
                        colValues.push(dataType.emitValue(dialect, col.dataType, row[col.name]));
                    }
                    catch (e) {
                        throw "SchemaTable.emitInsertRowSql(): колонка '" + col.name + "' в таблице '" + this.props.name + "': " + e.toString();
                    }
                }
                else {
                    if (col.notNull) {
                        throw "SchemaTable.emitInsertRowSql(): колонка '" + col.name + "' не может быть NULL в таблице '" + this.props.name + "'";
                    }
                }
            }
        });

        sql.push("(" + colNames.join(",") + ") \nVALUES(" + colValues.join(",") + ")\n");

        return sql.join("");

    }

    emitSelectRowSql(dialect: SqlDialect, rowId: any, columns?: string[], skipColumns?: string[]): SqlBatch {
        if (columns && !isArray(columns))
            throw "SchemaTable.emitSelectRowSql(): параметр 'columns' должен быть массивом строк";

        if (skipColumns && !isArray(skipColumns))
            throw "SchemaTable.emitSelectRowSql(): параметр 'skipColumns' должен быть массивом строк";

        let e = new SqlEmitter(dialect);

        let sql: string[] = [];
        let colNames: string[] = [];

        sql.push("SELECT ");

        let primaryKeyColumn = this.getPrimaryKeyColumn();
        if (!primaryKeyColumn)
            throw "SchemaTable.emitSelectRowSql(): не определен первичный ключ в таблице '" + this.props.name + "'";

        for (let col of this.props.columns) {
            // if (col.primaryKey)
            //     primaryKeyColumn = col;

            let colOk = true;
            if (columns && columns.indexOf(col.name) === -1)
                colOk = colOk && false;
            if (skipColumns && skipColumns.indexOf(col.name) > -1)
                colOk = colOk && false;

            if (colOk) {
                colNames.push(e.emit_NAME(col.name));
            }
        }

        sql.push(colNames.join(","));

        sql.push(" FROM " + e.emit_TABLE_NAME(this.props.sqlName || this.props.name));

        let dataType = appState.sqlDataTypes[primaryKeyColumn.dataType.id];
        sql.push(" WHERE " + e.emit_NAME(primaryKeyColumn.name) + "=" + dataType.emitValue(dialect, primaryKeyColumn.dataType, rowId));// this.valueToSql(primaryKeyColumn, this.rowId));

        return sql.join("");

    }

    emitUpdateRowSql(dialect: SqlDialect, row: any): SqlBatch {

        let e = new SqlEmitter(dialect);

        let sql: string[] = [];
        let colSets: string[] = [];

        sql.push("UPDATE " + e.emit_TABLE_NAME(this.props.sqlName || this.props.name) + " SET");

        let primaryKeyColumn = this.getPrimaryKeyColumn();
        if (!primaryKeyColumn)
            throw "SchemaTable.emitUpdateRowSql(): не определен первичный ключ в таблице '" + this.props.name + "'";

        for (let col of this.props.columns) {
            if (col.primaryKey)
                continue;

            if (row[col.name] !== undefined) {
                let dataType = appState.sqlDataTypes[col.dataType.id];
                try {
                    colSets.push("  " + e.emit_NAME(col.name) + "=" + dataType.emitValue(dialect, col.dataType, row[col.name]));
                }
                catch (e) {
                    throw "SchemaTable.emitUpdateRowSql(): колонка '" + col.name + "' в таблице '" + this.props.name + "': " + e.toString();
                }

            }
        }

        sql.push(colSets.join(","));

        let pkDataType = appState.sqlDataTypes[primaryKeyColumn.dataType.id];
        sql.push(" WHERE " + e.emit_NAME(primaryKeyColumn.name) + "=" + pkDataType.emitValue(dialect, primaryKeyColumn.dataType, row[primaryKeyColumn.name]));

        return sql.join("\n");

    }

    emitDeleteRowSql(dialect: SqlDialect, rowId: any): SqlBatch {

        let e = new SqlEmitter(dialect);

        let sql: string[] = [];
        let colSets: string[] = [];

        sql.push("DELETE FROM " + e.emit_TABLE_NAME(this.props.sqlName || this.props.name));

        let primaryKeyColumn = this.getPrimaryKeyColumn();
        if (!primaryKeyColumn)
            throw "SchemaTable.emitUpdateRowSql(): не определен первичный ключ в таблице '" + this.props.name + "'";

        let pkDataType = appState.sqlDataTypes[primaryKeyColumn.dataType.id];
        sql.push(" WHERE " + e.emit_NAME(primaryKeyColumn.name) + "=" + pkDataType.emitValue(dialect, primaryKeyColumn.dataType, rowId));

        return sql.join("");

    }

}
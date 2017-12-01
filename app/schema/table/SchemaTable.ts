import * as Joi from "joi";
import {alternatives} from "joi";
import {ISchemaObjectProps, SchemaObject} from "../SchemaObject";
import {IBaseSqlDataTypeProps} from "./datatypes/BaseSqlDataType";
import {joiRus} from "../../i18n/joiRus";
import {appState} from "../../AppState";
import {config} from "../../const/config";
import {SchemaTableDesignerWindow} from "../../admin/SchemaTableDesignerWindow";


export interface ISchemaTableProps extends ISchemaObjectProps {
    sqlName?: string;
    columns: ISchemaTableColumnProps[];
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
            name: Joi.string().min(1).max(config.sql.maxIdentifierLength).required().label("имя"),
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

}
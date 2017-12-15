import * as Joi from "joi";
import {alternatives} from "joi";
import {ISchemaObjectProps, SchemaObject} from "../SchemaObject";
import {joiRus} from "../../i18n/joiRus";
import {appState} from "../../AppState";
import {config} from "../../config";
import {SqlBatch, SqlDialect, SqlEmitter} from "../../sql/SqlEmitter";
import {isArray} from "../../utils/isArray";
import {SchemaQueryDesignerWindow} from "../../admin/SchemaQueryDesignerWindow";


export interface ISchemaQueryProps extends ISchemaObjectProps {
    root: ISchemaQueryColumnProps;
    //  editOptions?: ISchemaQueryEditOptions;
}

export interface ISchemaQueryColumnProps {
    key: string;
    fieldCaption?: string;
    fieldSource?: string;  // название поля - источника
    isDisabled?: boolean;
    isHidden?: boolean;
    tableId?: string;
    tableAlias?: string;
    children?: ISchemaQueryColumnProps[];
}



export class SchemaQuery extends SchemaObject<ISchemaQueryProps> { //implements ISchemaQueryRow {

    constructor(props: ISchemaQueryProps) {
        super(props);
    }

    static objectType = "query";
    static objectTypeName = "Запрос";
    static icon = "vendor/fugue/sql-join-left.png";
    static designerWindow = SchemaQueryDesignerWindow;

    getColumnValidator(): Joi.ObjectSchema {
        return Joi.object().options({language: joiRus}).keys({
       //     name: Joi.string().max(config.sql.maxIdentifierLength).required().label("имя"),
            description: Joi.string().max(config.sql.maxStringLength).label("описание"),
        })

    }

    getValidator(): Joi.ObjectSchema {
        return super.getValidator().keys({
            name: Joi.string().max(config.sql.maxIdentifierLength).required().label("имя запроса"),
            //root: Joi.array().items(this.getColumnValidator()).max(config.sql.maxColumnsInQuery).min(1).label("колонки")
        })
    };




}
import * as Joi from "joi";
import {ISchemaObjectProps, SchemaObject} from "../SchemaObject";
import {joiRus} from "../../i18n/joiRus";
import {config} from "../../config";
import {SchemaQueryDesignerWindow} from "../../admin/SchemaQueryDesignerWindow";
import {ISchemaTableProps, SchemaTable} from "../table/SchemaTable";
import {getRandomString} from "../../utils/getRandomString";
import {getSchemaObjectProps} from "../getSchemaObjectProps";
import {SqlSelectEmitter} from "../../sql/SqlSelectEmitter";


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

    root: SchemaQueryColumn;
    columnsByKey: { [key: string]: SchemaQueryColumn; } = {};


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

    async emitSqlTemplate(): Promise<string> {

        let emitter = new SqlSelectEmitter("mssql");

        await this.createTree();

        await this.emitColumn(this.root, emitter, 0);

        return emitter.toSql();
    }

    private async iterateNodeRecursive(node: ISchemaQueryColumnProps, parent?: ISchemaQueryColumnProps, parentColumn?: SchemaQueryColumn) {

        let column = new SchemaQueryColumn();
        column.props = node;
        column.query = this.props;

        if (!node.key)
            node.key = getRandomString();

        this.columnsByKey[node.key] = column;

        if (column.props.tableId) {
            column.joinTable = new SchemaTable(await getSchemaObjectProps<ISchemaTableProps>(column.props.tableId));
        }

        if (parentColumn) {
            column.parent = parentColumn;
            parentColumn.columns.push(column)
        }
        else {
            this.root = column;
        }

        if (node.children) {
            for (let _node of node.children) {
                await this.iterateNodeRecursive(_node, node, column);
            }
        }
    }

    async createTree() {
        await this.iterateNodeRecursive(this.props.root);
        //console.log("-- root----", this.root);

    }

    getColumn(key: string): SchemaQueryColumn {
        let ret = this.columnsByKey[key];
        if (!this.columnsByKey[key]) {
            let msg = "не найдена колонка, key:" + key;
            console.error(msg);
            throw msg;
        }
        else
            return ret;

    }

    private levelToStr(level: number) {
        return Array(level).join("    ");
    }

    async emitColumn(column: SchemaQueryColumn, emitter: SqlSelectEmitter, level: number) {

        if (!column.parent) {

            emitter.select.push("-- запрос: " + this.props.objectId);
            emitter.select.push("");

            emitter.select.push("SELECT");
            emitter.from.push(this.levelToStr(level) + "FROM");
            emitter.from.push(this.levelToStr(level) + "    " + emitter.emit_NAME(column.joinTable.getFullSqlName()) + " AS " + emitter.emit_NAME(column.joinTableAlias));
            for (let childColumn of column.columns) {
                await this.emitColumn(childColumn, emitter, level + 1);
            }
            // добавляем __recordId__
            emitter.fields.push(
                "    " +
                emitter.emit_NAME(column.joinTableAlias) + "." + emitter.emit_NAME(column.joinTable.getPrimaryKeyColumn()!.name) +
                " AS " + emitter.emit_NAME("__recordId__"));

        }
        else if (column.joinTable) {
            emitter.from.push(this.levelToStr(level) + "LEFT JOIN " + emitter.emit_NAME(column.joinTable.getFullSqlName()) + " AS " + emitter.emit_NAME(column.joinTableAlias));
            for (let childColumn of column.columns) {
                await this.emitColumn(childColumn, emitter, level + 1);
            }
            emitter.from.push(
                this.levelToStr(level) +
                "ON " +
                emitter.emit_NAME(column.parent.joinTableAlias) + "." + emitter.emit_NAME(column.props.fieldSource!) +
                "=" +
                emitter.emit_NAME(column.joinTableAlias) + "." + emitter.emit_NAME(column.joinTable.getPrimaryKeyColumn()!.name));
        }
        else {
            if (!column.props.isDisabled) {
                emitter.fields.push(
                    "    " +
                    emitter.emit_NAME(column.parent.joinTableAlias) + "." + emitter.emit_NAME(column.props.fieldSource!) +
                    " AS " +
                    emitter.emit_NAME(column.props.fieldCaption || column.props.fieldSource!));
            }
        }


    }

}

export class SchemaQueryColumn {
    query: ISchemaQueryProps;
    props: ISchemaQueryColumnProps;
    parent: SchemaQueryColumn;
    columns: SchemaQueryColumn[] = [];
    joinTable: SchemaTable;

    get joinTableAlias(): string {
        if (this.parent)
            return this.parent.joinTableAlias + "." + this.joinTable.getShortSqlName();
        else
            return this.joinTable.getShortSqlName();
    }
}

import * as Joi from "joi";
import {ISchemaObjectProps, SchemaObject} from "../SchemaObject";
import {joiRus} from "../../i18n/joiRus";
import {config} from "../../config";
import {SchemaQueryDesignerWindow} from "../../admin/SchemaQueryDesignerWindow";
import {ISchemaTableProps, SchemaTable} from "../table/SchemaTable";
import {getRandomString} from "../../utils/getRandomString";
import {getSchemaObjectProps} from "../getSchemaObjectProps";
import {SqlSelectEmitter} from "../../sql/SqlSelectEmitter";
import {addNewLineSymbol} from "../../utils/addNewLineSymbol";
import {executeSql, ISqlDataset} from "../../sql/executeSql";
import {throwError} from "../../utils/throwError";


export interface ISchemaQueryProps extends ISchemaObjectProps {
    root: ISchemaQueryColumnProps;
    sqlBefore?: string;
    sqlSelect?: string;
    sqlJoin?: string;
    sqlWhere?: string;
    sqlAfter?: string;
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

    private root: SchemaQueryColumn;
    columnsByKey: { [key: string]: SchemaQueryColumn; } = {};
    columns: SchemaQueryColumn[] = [];

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

    async getRootColumn(): Promise<SchemaQueryColumn> {
        if (!this.root) {
            await this.createTree();
        }
        return this.root;
    }

    async execute(paramsObj: any = {}, dbName?: string): Promise<ISqlDataset[]> {
        if (!dbName)
            dbName = (await this.getRootColumn()).joinTable.props.dbName;
        return executeSql(this.props.objectId!, paramsObj, dbName);
    }

    async emitSqlTemplate(): Promise<string> {

        let emitter = new SqlSelectEmitter("mssql");

        await this.createTree();

        await this.emitColumn(this.root, emitter, 0);

        let sql: string[] = [];

        sql.push("-- запрос: " + this.props.objectId);
        sql.push("\n\n");

        if (this.props.sqlBefore) {
            sql.push("/************** SQL-before: начало **************/\n");
            sql.push(addNewLineSymbol(this.props.sqlBefore));
            sql.push("/************** SQL-before: конец  **************/\n\n");
        }

        sql.push(emitter.select.join("\n") + "\n");
        sql.push(emitter.fields.join(",\n"));

        if (this.props.sqlSelect) {
            sql.push(",\n");
            sql.push("    /************** SQL-select: начало **************/\n");
            sql.push(addNewLineSymbol(this.props.sqlSelect.split("\n").map((line) => "    " + line).join("\n")));
            sql.push("    /************** SQL-select: конец  **************/\n");
        }
        else
            sql.push("\n");

        sql.push(emitter.from.join("\n") + "\n");

        if (this.props.sqlJoin) {
            sql.push("    /************** SQL-join: начало **************/\n");
            sql.push(addNewLineSymbol(this.props.sqlJoin.split("\n").map((line) => "    " + line).join("\n")));
            sql.push("    /************** SQL-join: конец  **************/\n");
        }

        if (emitter.where.length > 0 || this.props.sqlWhere)
            sql.push("WHERE");

        if (emitter.where.length > 0)
            sql.push("\n    " + emitter.where.join(" AND \n"));

        if (this.props.sqlWhere) {
            if (emitter.where.length > 0)
                sql.push(" AND\n");
            else
                sql.push("\n");
            sql.push("    /************** SQL-where: начало *************/\n");
            sql.push(addNewLineSymbol(this.props.sqlWhere.split("\n").map((line) => "    " + line).join("\n")));
            sql.push("    /************** SQL-where: конец  *************/\n");
        }
        else
            sql.push("\n");


        if (this.props.sqlAfter) {
            sql.push("\n/************** SQL-after: начало **************/\n");
            sql.push(addNewLineSymbol(this.props.sqlAfter));
            sql.push("/************** SQL-after: конец  **************/\n");
        }

        return sql.join("");

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
        else
            this.columns.push(column);

    }

    async createTree() {
        this.columnsByKey = {};
        this.columns = [];

        await this.iterateNodeRecursive(this.props.root);
        //console.log("-- root----", this.root);

    }

    getColumn(key: string): SchemaQueryColumn {
        let ret = this.columnsByKey[key];
        if (!this.columnsByKey[key]) {
            let msg = "не найдена колонка, key:" + key;
            throwError(msg);
        }
        else
            return ret;

        throw "fake";
    }

    private levelToStr(level: number) {
        return Array(level).join("    ");
    }

    async emitColumn(column: SchemaQueryColumn, emitter: SqlSelectEmitter, level: number) {

        if (!column.parent) {


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
            emitter.from.push(this.levelToStr(level) + "    LEFT JOIN " + emitter.emit_NAME(column.joinTable.getFullSqlName()) + " AS " + emitter.emit_NAME(column.joinTableAlias));
            for (let childColumn of column.columns) {
                await this.emitColumn(childColumn, emitter, level + 1);
            }
            emitter.from.push(
                this.levelToStr(level) +
                "    ON " +
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
            return this.parent.joinTableAlias + "." + (this.props.tableAlias || this.joinTable.getShortSqlName());
        else
            return this.props.tableAlias || this.joinTable.getShortSqlName();
    }
}

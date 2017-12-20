import * as  React from "react";
import {CSSProperties} from "react";

import {Window} from "../ui/Window";
import {TabsPanel} from "../ui/TabsPanel";
import {TabsPanelItem} from "../ui/TabsPanelItem";
import {omit} from "../utils/omit";
import {FormPanel} from "../ui/FormPanel";
import {Input} from "../ui/inputs/Input";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {Button} from "../ui/Button";
import {loadSchemaObjectFiles} from "./api/loadSchemaObjectFiles";
import {getErrorWindow, showError} from "../ui/modals/showError";
import {ISchemaQueryColumnProps, ISchemaQueryProps, SchemaQuery} from "../schema/query/SchemaQuery";
import {config} from "../config";
import {ISchemaObjectDesignerProps, SchemaObjectBaseDesignerWindow} from "./SchemaObjectBaseDesignerWindow";
import {XJSON_clone, XJSON_equals, XJSON_parse, XJSON_stringify} from "../utils/xjson";
import {ITreeGridSource, TreeGrid} from "../ui/TreeGrid";
import {Menu} from "../ui/Menu";
import {getRandomString} from "../utils/getRandomString";
import {MenuItem} from "../ui/MenuItem";
import {MenuSeparator} from "../ui/MenuSeparator";
import {TreeGridColumn} from "../ui/TreeGridColumn";
import {FlexVPanel} from "../ui/FlexVPanel";
import {SchemaQueryDesignerSqlWindow} from "./SchemaQueryDesignerSqlWindow";
import {appState} from "../AppState";
import {SchemaQueryColumnEditorWindow} from "./SchemaQueryColumnEditorWindow";
import {assignObject} from "../utils/assignObject";
import {joiValidate} from "../validation/joiValidate";
import {SchemaObject} from "../schema/SchemaObject";
import {ISavedSchemaObjectFiles, saveSchemaObjectFiles} from "./api/saveSchemaObjectFiles";
import {SchemaQueryDesignerAddFieldsWindow} from "./SchemaQueryDesignerAddFieldsWindow";
import {getConfirmation} from "../ui/modals/getConfirmation";
import {CodeEditor} from "../ui/inputs/CodeEditor";
import {SchemaQueryTestRunWindow} from "./SchemaQueryTestRunWindow";


export interface ISchemaQueryDesignerProps extends ISchemaObjectDesignerProps {
    //queryId?: string;
    //window?: IWindowProps;
}


export class SchemaQueryDesignerWindow extends SchemaObjectBaseDesignerWindow {

    window: Window;
    treeGrid: TreeGrid;
    treeGridSource: ITreeGridSource;
    form: FormPanel;
    error: any;
    errorTitle: string;
    query: ISchemaQueryProps;
    initialQuery: ISchemaQueryProps;
    //queryColumnsArray: any;
    saveButton: Button;
    closeButton: Button;

    addColumnClickHandler = async (parentRow: any) => {
        if (!parentRow.tableId)
            parentRow = parentRow.parent;

        let originalParentRow = TreeGrid.findRowInDataSourceObject(this.query.root, "key", parentRow.key);
        let tableId: string = parentRow.tableId;// || parentRow.parent.tableId;

        let result = await this.window.openParentWindow(
            <SchemaQueryDesignerAddFieldsWindow
                window={{height: 500, width: 400}}
                objectId={tableId}>
            </SchemaQueryDesignerAddFieldsWindow>
        );

        console.log("qqq", result);
        for (let tableColumn of result) {
            let newQueryColumn = {
                key: getRandomString(),
                fieldSource: tableColumn.name,
            };
            originalParentRow.children.push(newQueryColumn);
            this.treeGrid.addRow(newQueryColumn.key, XJSON_clone(newQueryColumn), "last", parentRow.key);
        }
        this.treeGrid.updateRow(parentRow.key, originalParentRow);
    };

    editColumnClickHandler = async (row: any) => {

        let originalEditedRow = TreeGrid.findRowInDataSourceObject(this.query.root, "key", row.key);
        if (!originalEditedRow)
            throw "SchemaQueryDesignerWindow.editColumnClickHandler): internal error";

        let resultOk = await this.window.openParentWindow(
            <SchemaQueryColumnEditorWindow
                query={this.query}
                column={originalEditedRow}
                window={{height: 500, width: 700}}
            />
        );
        if (resultOk) {
            assignObject(row, originalEditedRow);
            this.treeGrid.updateRow(row.key, row);
        }
        this.treeGrid.focus();
    };

    deleteColumnClickHandler = async () => {
        // let columnIndex = this.columnsGrid.getSelectedRowIndex();
        // if (columnIndex < 0) {
        //     await showError("колонка не выбрана");
        //     return;
        // }
        //
        // let editedColumn = XJSON_clone(this.queryColumnsArray.get(columnIndex));
        //
        // let confirmed = await getConfirmation("Удалить колонку '" + editedColumn.name + "'?", "Удаление", "Удалить", "Отмена");
        //
        // if (confirmed) {
        //     this.queryColumnsArray.splice(columnIndex, 1);
        //     this.columnsGrid.selectRow(Math.min(columnIndex, this.queryColumnsArray.length - 1));
        // }
        // this.columnsGrid.focus();
    };

    async componentDidMount() {


        if (this.props.objectId) { // редактирование запроса

            try {
                let res = await loadSchemaObjectFiles(this.props.objectId!);

                if (res.json) {
                    this.query = XJSON_parse(res.json);
                    TreeGrid.setRandomKeysInDataSourceObject(this.query.root, "key");
                    this.query.objectId = this.props.objectId;
                    this.initialQuery = XJSON_clone(this.query);
                }
                else {
                    this.error = "не найден запрос: " + this.props.objectId;
                }

                let result = new SchemaQuery(this.query).validate();
                if (result) {
                    this.errorTitle = "Ошибка загрузки файла";
                    throw result;
                }

                this.treeGridSource = {
                    localData: [XJSON_clone(this.query).root],
                    dataType: "json",
                    id: "key",
                    hierarchy: {
                        root: "children"
                    },
                    // todo заполнение dataFields как в Grid
                    // dataFields: [
                    //     {name: "name", type: "string"},
                    // ]
                };

                this.forceUpdate();

            }
            catch (error) {
                this.error = error;
                this.forceUpdate();
            }
        }
        else { // создание нового запроса

            this.query = {
                objectType: SchemaQuery.objectType,
                name: "новый запрос",
                root:
                    {
                        key: "",
                        tableId: "",
                        tableAlias: "",
                        children: []
                    }
            };
            //this.queryColumnsArray = new ($ as any).jqx.observableArray(this.query.columns);
            let result = new SchemaQuery(this.query).validate();
            this.forceUpdate();
        }

    }

    handleClickSaveButton = async () => {

        let validator = new SchemaQuery(this.query).getValidator();

        let validationError = joiValidate(this.query, validator);

        if (validationError) {
            await showError(validationError);
            return
        }

        TreeGrid.removeRandomKeysInDataSourceObject(this.query.root, "key");
        new SchemaObject(this.query).setChangedUserAndDate();

        let fielPath = this.props.objectId || this.props.newObjectPath + "/" + this.query.name + "." + SchemaQuery.objectType;
        let sql = await new SchemaQuery(this.query).emitSqlTemplate();

        delete this.query.objectId;

        let req: ISavedSchemaObjectFiles = {
            filePath: fielPath,
            json: XJSON_stringify(this.query),
            sql: sql
        };
        try {
            await saveSchemaObjectFiles(req);
            this.window.close(req.filePath);
        }
        catch (err) {
            showError(err.toString());
        }

    };

    handleClickCloseButton = async () => {
        let needConfirmation = this.form!.needSaveChanges;
        needConfirmation = needConfirmation || !XJSON_equals(this.query, this.initialQuery);

        if (!needConfirmation || await getConfirmation("Выйти без сохранения?"))
            this.window.close();

    };

    createPopupMenu = async (rowItem: any) => {

        if (rowItem.hasItems) {
            return (
                <Menu mode="popup" key={getRandomString()}>
                    <MenuItem
                        title="Выполнить все тесты"
                        onClick={async () => {
                            //this.handleOpenTableDesigner_for_create(rowItem);
                        }}>
                    </MenuItem>
                </Menu>
            )
        }
        else
            return (
                <Menu mode="popup" key={getRandomString()}>
                    <MenuItem title="Выполнить тест" icon={config.button.cancelIcon}></MenuItem>
                    <MenuSeparator/>
                    <MenuItem title="Открыть исходный текст" icon={config.button.cancelIcon}></MenuItem>
                </Menu>
            )
    };

    getRootColumnText = (row: ISchemaQueryColumnProps): React.ReactNode => {
        let style: CSSProperties = {};

        if (!!row.tableId && !row.fieldSource)
            return <span style={{fontWeight: "bold"}}>{row.tableId}</span>;
        else if (!row.tableId && !!row.fieldSource)
            return <span>{row.fieldSource}</span>;
        else
            return <span style={{fontWeight: "bold"}}>{row.fieldSource}<span
                style={{fontWeight: 500, color: config.sql.fkDataTypeColor}}>->{row.tableId}</span></span>;

    };

    getColumnCaptionText = (row: ISchemaQueryColumnProps): React.ReactNode => {
        let style: CSSProperties = {};

        if (row.tableId)
            return null;
        else if (row.fieldCaption)
            return <span>{row.fieldCaption}</span>;
        else
            return <span style={{color: "silver"}}>{row.fieldSource}</span>;

    };

    render() {

        if (this.error) {
            return getErrorWindow(this.error, this.errorTitle);
        }

        if (!this.query)
            return null;

        let validator = new SchemaQuery(this.query).getValidator();

        console.log("render SchemaQueryDesignerWindow");
        return (
            <Window
                {...omit(this.props.window, ["children"])}
                storageKey="SchemaQueryDesignerWindow"
                title={this.props.objectId ? "запрос: " + this.props.objectId : "новая запрос в \"" + this.props.newObjectPath + "\""}
                icon={SchemaQuery.icon}
                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    <FlexItem dock="fill">
                        <TabsPanel>

                            <TabsPanelItem title="Запрос">
                                <FlexHPanel>
                                    <FlexItem dock="top">
                                        запрос контент ЗАГОЛОВОК
                                    </FlexItem>
                                    <FlexItem dock="fill">
                                        <FormPanel ref={(e) => this.form = e!} bindObj={this.query}
                                                   validator={validator}>

                                            <Input
                                                title="имя"

                                                bindProp="name"
                                                placeHolder="имя таблицы"

                                            />

                                            <Input title="описание" bindProp="description"/>

                                            <Input width={400} bindProp="note" placeHolder="note"
                                                   title="примечание"/>
                                        </FormPanel>
                                    </FlexItem>
                                    <FlexItem dock="top">
                                        запрос контент ФУТТЕР
                                    </FlexItem>
                                </FlexHPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="Структура">
                                <FlexHPanel>
                                    <FlexItem dock="top">
                                        фильтр по названию
                                    </FlexItem>
                                    <FlexItem dock="fill">

                                        {/**************************** структура запроса в виде дерева *************/}
                                        <FlexItem dock="fill">
                                            <TreeGrid
                                                ref={(e: any) => this.treeGrid = e!}
                                                source={this.treeGridSource}
                                                onRowDoubleClick={async (row) => {
                                                    this.editColumnClickHandler(row)
                                                }}
                                                popup={this.createPopupMenu}
                                                enableHover={false}
                                                expandAll

                                            >
                                                <TreeGridColumn headerText="Таблица/Колонка"
                                                                getText={this.getRootColumnText}/>
                                                <TreeGridColumn headerText="Заголовок"
                                                                getText={this.getColumnCaptionText}/>

                                            </TreeGrid>
                                        </FlexItem>
                                        {/**************************** структура запроса в виде дерева *************/}

                                    </FlexItem>
                                    <FlexItem dock="bottom" style={{paddingTop: 8, paddingBottom: 10}}>
                                        <Button imgSrc={config.button.insertRowIcon}
                                                text="Добавить колонку"
                                                tooltip="добавить новую колонку (ESC)"
                                                height={26}
                                                style={{marginRight: 5}}
                                                onClick={async () => {
                                                    let row = this.treeGrid.getSelection()[0];
                                                    if (!row) {
                                                        await showError("колонка не выбрана");
                                                        return;
                                                    }
                                                    await this.addColumnClickHandler(row)
                                                }}
                                        />
                                        <Button imgSrc={config.button.changeRowIcon}
                                                text="Изменить"
                                                tooltip="редактировать колонку (ENTER)"
                                                height={26}
                                                style={{marginRight: 5}}
                                                onClick={async () => {
                                                    let row = this.treeGrid.getSelection()[0];
                                                    if (!row) {
                                                        await showError("колонка не выбрана");
                                                        return;
                                                    }
                                                    await this.editColumnClickHandler(row)
                                                }}
                                        />
                                        <Button imgSrc={config.button.deleteRowIcon}
                                                text="Удалить"
                                                tooltip="удалить колонку (DEL)"
                                                height={26}
                                                style={{marginRight: 5}}
                                                onClick={this.deleteColumnClickHandler}

                                        />
                                    </FlexItem>
                                </FlexHPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title={(this.query.sqlBefore ? "+" : "") + "SQL-before"}>
                                <CodeEditor
                                    title="" options={{mode: "text/x-mssql", theme: "sql-template"}}
                                    bindObj={this.query}
                                    bindProp="sqlBefore"
                                    onChange={async () => this.forceUpdate()}
                                />
                            </TabsPanelItem>

                            <TabsPanelItem title={(this.query.sqlSelect ? "+" : "") + "SQL-select"}>
                                <CodeEditor
                                    title="" options={{mode: "text/x-mssql", theme: "sql-template"}}
                                    bindObj={this.query}
                                    bindProp="sqlSelect"
                                    onChange={async () => this.forceUpdate()}
                                />
                            </TabsPanelItem>

                            <TabsPanelItem title={(this.query.sqlJoin ? "+" : "") + "SQL-join"}>
                                <CodeEditor
                                    title="" options={{mode: "text/x-mssql", theme: "sql-template"}}
                                    bindObj={this.query}
                                    bindProp="sqlJoin"
                                    onChange={async () => this.forceUpdate()}
                                />
                            </TabsPanelItem>

                            <TabsPanelItem title={(this.query.sqlWhere ? "+" : "") + "SQL-where"}>
                                <CodeEditor
                                    title="" options={{mode: "text/x-mssql", theme: "sql-template"}}
                                    bindObj={this.query}
                                    bindProp="sqlWhere"
                                    onChange={async () => this.forceUpdate()}
                                />
                            </TabsPanelItem>

                            <TabsPanelItem title={(this.query.sqlAfter ? "+" : "") + "SQL-after"}>
                                <CodeEditor
                                    title="" options={{mode: "text/x-mssql", theme: "sql-template"}}
                                    bindObj={this.query}
                                    bindProp="sqlAfter"
                                    onChange={async () => this.forceUpdate()}
                                />
                            </TabsPanelItem>

                        </TabsPanel>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, paddingTop: 10 /*justifyContent: "flex-end"*/}}>
                        <FlexVPanel>
                            <FlexItem dock="left">
                                {/**************************** Button "Тест" *************/}
                                <Button
                                    text="Тест"
                                    imgSrc="vendor/fugue/table--arrow.png"
                                    onClick={async () => {
                                        appState.desktop.openWindow(
                                            <SchemaQueryTestRunWindow
                                                query={this.query}
                                                window={{height: 500, width: 700}}
                                            />
                                        );
                                    }}
                                />
                                {/**************************** Button "Показать SQL"а *************/}
                                <Button
                                    text="Показать SQL"
                                    onClick={async () => {
                                        let sql = await new SchemaQuery(this.query).emitSqlTemplate();
                                        appState.desktop.openWindow(
                                            <SchemaQueryDesignerSqlWindow
                                                sql={sql}
                                                window={{height: 500, width: 700}}
                                            />
                                        );
                                    }}
                                />
                            </FlexItem>
                            <FlexItem dock="fill" style={{justifyContent: "flex-end"}}>
                                <Button imgSrc={config.button.saveIcon}
                                        text="Сохранить"
                                        style={{marginRight: 5}}
                                        ref={(e) => this.saveButton = e!}
                                        onClick={this.handleClickSaveButton}/>
                                <Button imgSrc={config.button.cancelIcon}
                                        text="Отмена"
                                        ref={(e) => this.closeButton = e!}
                                        onClick={this.handleClickCloseButton}/>
                            </FlexItem>
                        </FlexVPanel>
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )
    }

}
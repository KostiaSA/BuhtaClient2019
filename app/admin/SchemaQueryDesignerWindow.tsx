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
import {XJSON_clone, XJSON_parse, XJSON_stringify} from "../utils/xjson";
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
    queryColumnsArray: any;
    saveButton: Button;
    closeButton: Button;

    addColumnClickHandler = async () => {
        // let columnIndex = this.columnsGrid.getSelectedRowIndex();
        //
        // let editedColumn: ISchemaQueryColumnProps = {
        //     name: "новая колонка",
        //     dataType: {
        //         id: StringSqlDataType.id
        //     }
        // };
        // let dt = appState.sqlDataTypes[StringSqlDataType.id];
        // dt.setDefaultProps(editedColumn.dataType);
        //
        // let resultOk = await this.window.openParentWindow(
        //     <SchemaQueryColumnEditorWindow
        //         query={this.query}
        //         column={editedColumn}
        //         window={{height: 500, width: 600}}
        //     />
        // );
        // if (resultOk) {
        //     this.queryColumnsArray.push(editedColumn);
        //     this.columnsGrid.selectRow(this.queryColumnsArray.length - 1);
        //
        // }
        // this.columnsGrid.focus();
    };

    editColumnClickHandler = async (row: any) => {
        console.log(row);
        // let columnIndex = this.treeGrid.getSelectedRowIndex();
        // if (columnIndex < 0) {
        //     await showError("колонка не выбрана");
        //     return;
        // }
        //

        let originalEditedRow = TreeGrid.findRowInDataSourceObject(this.query.root, "key", row.key);
        if (!originalEditedRow)
            throw "SchemaQueryDesignerWindow.editColumnClickHandler): internal error";

        //let editedRow=XJSON_clone(originalEditedRow);

        let resultOk = await this.window.openParentWindow(
            <SchemaQueryColumnEditorWindow
                query={this.query}
                column={originalEditedRow}
                window={{height: 500, width: 700}}
            />
        );
        if (resultOk) {
            //assignObject(originalEditedRow,editedRow);
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

    //  random $keys

    async componentDidMount() {


        if (this.props.objectId) { // редактирование запроса

            try {
                let res = await loadSchemaObjectFiles(this.props.objectId!);

                if (res.json) {
                    this.query = XJSON_parse(res.json);
                    TreeGrid.setRandomKeysInDataSourceObject(this.query.root, "key");
                    this.query.objectId = this.props.objectId;
                    //this.queryColumnsArray = new ($ as any).jqx.observableArray(this.query.columns);
                }
                else {
                    this.error = "не найден запрос: " + this.props.objectId;
                }

                let result = new SchemaQuery(this.query).validate();
                if (result) {
                    this.errorTitle = "Ошибка загрузки файла";
                    throw result;
                }

                //this.preprocessDataSource(res, 0, "");

                this.treeGridSource = {
                    localData: [XJSON_clone(this.query).root],
                    dataType: "json",
                    id: "key",
                    hierarchy: {
                        root: "children"
                    },
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
        delete this.query.objectId;

        let req: ISavedSchemaObjectFiles = {
            filePath: fielPath,
            json: XJSON_stringify(this.query)
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
        // let needConfirmation = this.form!.needSaveChanges;
        // needConfirmation = needConfirmation || !XJSON_equals(this.query.columns, this.queryColumnsArray.toArray());
        // this.query.columns = this.queryColumnsArray.toArray();
        //
        // if (!needConfirmation || await getConfirmation("Выйти без сохранения?"))
        //     this.window.close();

        this.window.close();
    };


    // dataTypeColumnCompute = (row: ISchemaQueryColumnProps): React.ReactNode => {
    //     let dt = appState.sqlDataTypes[row.dataType.id];
    //     return <span style={{color: dt.getDesignerColor()}}>{dt.getName(row.dataType)}</span>;
    // };
    //
    // pkColumnCompute = (row: ISchemaQueryColumnProps): React.ReactNode => {
    //     if (row.primaryKey)
    //         return <img src="vendor/fugue/key.png"/>;
    //     else
    //         return null;
    // };

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
                {/*Дизайнер таблицы {this.props.queryId}*/}

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
                                                bindObj={this.query}
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
                                                <TreeGridColumn headerText="Заголовок" background="ivory"
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
                                                onClick={this.addColumnClickHandler}
                                        />
                                        <Button imgSrc={config.button.changeRowIcon}
                                                text="Изменить"
                                                tooltip="редактировать колонку (ENTER)"
                                                height={26}
                                                style={{marginRight: 5}}
                                                onClick={async () => {
                                                    this.editColumnClickHandler(null)
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

                            <TabsPanelItem title="Индексы">
                                индексы контент
                            </TabsPanelItem>

                        </TabsPanel>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, paddingTop: 10 /*justifyContent: "flex-end"*/}}>
                        <FlexVPanel>
                            <FlexItem dock="left">
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
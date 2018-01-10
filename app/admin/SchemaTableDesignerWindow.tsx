import * as  React from "react";

import {Window} from "../ui/Window";
import {TabsPanel} from "../ui/TabsPanel";
import {TabsPanelItem} from "../ui/TabsPanelItem";
import {omit} from "../utils/omit";
import {FormPanel} from "../ui/FormPanel";
import {Input} from "../ui/inputs/Input";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {Grid} from "../ui/Grid";
import {GridColumn} from "../ui/GridColumn";
import {Button} from "../ui/Button";
import {SchemaTableColumnEditorWindow} from "./SchemaTableColumnEditorWindow";
import {Keycode} from "../utils/Keycode";
import {loadSchemaObjectFiles} from "./api/loadSchemaObjectFiles";
import {ISavedSchemaObjectFiles, saveSchemaObjectFiles} from "./api/saveSchemaObjectFiles";
import {getErrorWindow, showError} from "../ui/modals/showError";
import {ISchemaTableColumnProps, ISchemaTableProps, SchemaTable} from "../schema/table/SchemaTable";
import {appState} from "../AppState";
import {StringSqlDataType} from "../schema/table/datatypes/StringSqlDataType";
import {getConfirmation} from "../ui/modals/getConfirmation";
import {config} from "../config";
import {joiValidate} from "../validation/joiValidate";
import {ISchemaObjectDesignerProps, SchemaObjectBaseDesignerWindow} from "./SchemaObjectBaseDesignerWindow";
import {XJSON_clone, XJSON_equals, XJSON_parse, XJSON_stringify} from "../utils/xjson";
import {SchemaObject} from "../schema/SchemaObject";
import {ComboBox} from "../ui/inputs/ComboBox";
import {getDatabasesList} from "../sql/getDatabasesList";
import {throwError} from "../utils/throwError";
import {schemaObjectJsonCache} from "../schema/getSchemaObjectProps";


export interface ISchemaTableDesignerProps extends ISchemaObjectDesignerProps {
    //tableId?: string;
    //window?: IWindowProps;
}

export class SchemaTableDesignerWindow extends SchemaObjectBaseDesignerWindow {

    saveButton: Button;
    closeButton: Button;

    addColumnClickHandler = async () => {
        let columnIndex = this.columnsGrid.getSelectedRowIndex();

        let editedColumn: ISchemaTableColumnProps = {
            name: "новая колонка",
            dataType: {
                id: StringSqlDataType.id
            }
        };
        let dt = appState.sqlDataTypes[StringSqlDataType.id];
        dt.setDefaultProps(editedColumn.dataType);

        let resultOk = await this.window.openParentWindow(
            <SchemaTableColumnEditorWindow
                table={this.table}
                column={editedColumn}
                window={{height: 500, width: 600}}
            />
        );
        if (resultOk) {
            this.tableColumnsArray.push(editedColumn);
            this.columnsGrid.selectRow(this.tableColumnsArray.length - 1);

        }
        this.columnsGrid.focus();
    };

    editColumnClickHandler = async () => {
        let columnIndex = this.columnsGrid.getSelectedRowIndex();
        if (columnIndex < 0) {
            await showError("колонка не выбрана");
            return;
        }

        let editedColumn = XJSON_clone(this.tableColumnsArray.get(columnIndex));

        let resultOk = await this.window.openParentWindow(
            <SchemaTableColumnEditorWindow
                table={this.table}
                column={editedColumn}
                window={{height: 500, width: 700}}
            />
        );
        if (resultOk) {
            this.tableColumnsArray.set(columnIndex, editedColumn);
        }
        this.columnsGrid.focus();
    };

    deleteColumnClickHandler = async () => {
        let columnIndex = this.columnsGrid.getSelectedRowIndex();
        if (columnIndex < 0) {
            await showError("колонка не выбрана");
            return;
        }

        let editedColumn = XJSON_clone(this.tableColumnsArray.get(columnIndex));

        let confirmed = await getConfirmation("Удалить колонку '" + editedColumn.name + "'?", "Удаление", "Удалить", "Отмена");

        if (confirmed) {
            this.tableColumnsArray.splice(columnIndex, 1);
            this.columnsGrid.selectRow(Math.min(columnIndex, this.tableColumnsArray.length - 1));
        }
        this.columnsGrid.focus();
    };

    error: any;
    errorTitle: string;
    table: ISchemaTableProps;
    tableColumnsArray: any;

    async componentDidMount() {


        if (this.props.objectId) { // редактирование таблицы

            try {
                let res = await loadSchemaObjectFiles(this.props.objectId!);

                if (res.json) {
                    this.table = XJSON_parse(res.json);
                    this.table.objectId = this.props.objectId;
                    this.tableColumnsArray = new ($ as any).jqx.observableArray(this.table.columns);
                }
                else {
                    this.error = "не найден объект: " + this.props.objectId;
                }

                let result = new SchemaTable(this.table).validate();
                if (result) {
                    this.errorTitle = "Ошибка загрузки файла";
                    throwError(result);
                }

                this.forceUpdate();

            }
            catch (error) {
                this.error = error;
                this.forceUpdate();
            }
        }
        else { // создание новой таблицы

            this.table = {
                objectType: SchemaTable.objectType,
                name: "новая таблица",
                columns: [
                    {
                        "name": "Ключ",
                        "dataType": {
                            "id": "Integer",
                            "size": "16"
                        }
                    } as any
                ],
            };
            this.tableColumnsArray = new ($ as any).jqx.observableArray(this.table.columns);
            let result = new SchemaTable(this.table).validate();
            this.forceUpdate();
        }

    }

    handleClickSaveButton = async () => {

        this.table.columns = this.tableColumnsArray.toArray();

        let validator = new SchemaTable(this.table).getValidator();

        let validationError = joiValidate(this.table, validator);

        if (validationError) {
            await showError(validationError);
            return
        }

        new SchemaObject(this.table).setChangedUserAndDate();
        let fielPath = this.props.objectId || this.props.newObjectPath + "/" + this.table.name + "." + SchemaTable.objectType;
        delete this.table.objectId;

        let req: ISavedSchemaObjectFiles = {
            filePath: fielPath,
            json: XJSON_stringify(this.table)
        };

        try {
            await saveSchemaObjectFiles(req);
            delete schemaObjectJsonCache[this.props.objectId!];

            this.window.close(req.filePath);
        }
        catch (err) {
            showError(err.toString());
        }

    };

    handleClickCloseButton = async () => {
        let needConfirmation = this.form!.needSaveChanges;
        needConfirmation = needConfirmation || !XJSON_equals(this.table.columns, this.tableColumnsArray.toArray());
        this.table.columns = this.tableColumnsArray.toArray();

        if (!needConfirmation || await getConfirmation("Выйти без сохранения?"))
            this.window.close();
    };

    window: Window;
    columnsGrid: Grid;
    form: FormPanel;

    dataTypeColumnCompute = (row: ISchemaTableColumnProps): React.ReactNode => {
        let dt = appState.sqlDataTypes[row.dataType.id];
        return <span style={{color: dt.getDesignerColor()}}>{dt.getName(row.dataType)}</span>;
    };

    pkColumnCompute = (row: ISchemaTableColumnProps): React.ReactNode => {
        if (row.primaryKey)
            return <img src="vendor/fugue/key.png"/>;
        else
            return null;
    };

    getFullSqlName = (): string => {
        let table = new SchemaTable(this.table);
        return table.getFullSqlName();
    };

    render() {

        if (this.error) {
            return getErrorWindow(this.error, this.errorTitle);
        }

        if (!this.table)
            return null;

        let validator = new SchemaTable(this.table).getValidator();

        console.log("render SchemaTableDesignerWindow");
        return (
            <Window
                {...omit(this.props.window, ["children"])}
                storageKey="SchemaTableDesignerWindow"
                title={this.props.objectId ? "таблица: " + this.props.objectId : "новая таблица в \"" + this.props.newObjectPath + "\""}
                icon="vendor/fugue/table.png"
                ref={(e) => {
                    this.window = e!
                }}>
                {/*Дизайнер таблицы {this.props.tableId}*/}

                <FlexHPanel>
                    <FlexItem dock="fill">
                        <TabsPanel>

                            <TabsPanelItem title="Таблица">
                                <FlexHPanel>
                                    <FlexItem dock="top">
                                        таблица контент ЗАГОЛОВОК
                                    </FlexItem>
                                    <FlexItem dock="fill">
                                        <FormPanel ref={(e) => this.form = e!} bindObj={this.table}
                                                   validator={validator}>

                                            <Input
                                                title="имя"
                                                bindObj={this.table}
                                                bindProp="name"
                                                placeHolder="имя таблицы"
                                                readOnly
                                            />

                                            <Input title="описание" bindProp="description"
                                                   placeHolder="краткое описание"
                                                   resizable storageKey="input:description"
                                            />

                                            <Input title="sql имя" bindProp="sqlName"
                                                   placeHolder={this.getFullSqlName()}
                                                   resizable storageKey="input:sqlName"
                                            />

                                            <Input width={400} bindProp="note"
                                                   placeHolder="note" title="примечание"
                                            />

                                            <ComboBox
                                                title="база данных"
                                                bindProp="dbName"
                                                valueMember="name"
                                                displayMember="name"
                                                width={200}
                                                source={getDatabasesList}
                                                resizable storageKey="input:dbName"
                                            />

                                            {/*<FormPanelHGroup>*/}
                                            {/*<CheckBox title="первичный ключ" bindProp="primaryKey" width={150}/>*/}
                                            {/*<Input width={200} bindProp="note"*/}
                                            {/*resizable storageKey="input:dbName2222222"*/}
                                            {/*placeHolder="note" title="примечание2"*/}
                                            {/*/>*/}
                                            {/*<CheckBox title="NOT NULL" bindProp="notNull" width={100}/>*/}

                                            {/*<Input width={200} bindProp="note"*/}
                                            {/*placeHolder="note" title="примечание3"*/}
                                            {/*/>*/}

                                            {/*</FormPanelHGroup>*/}

                                        </FormPanel>
                                    </FlexItem>
                                    <FlexItem dock="top">
                                        таблица контент ФУТТЕР
                                    </FlexItem>
                                </FlexHPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="Колонки">
                                <FlexHPanel>
                                    <FlexItem dock="top">
                                        фильтр по названию
                                    </FlexItem>
                                    <FlexItem dock="fill">
                                        <Grid
                                            ref={(e) => {
                                                this.columnsGrid = e!
                                            }}
                                            source={this.tableColumnsArray}
                                            onRowDoubleClick={this.editColumnClickHandler}
                                            onRowKeyDown={(rowIndex, keyCode) => {
                                                if (keyCode === Keycode.Insert) {
                                                    this.addColumnClickHandler();
                                                    return true;
                                                }
                                                else if (keyCode === Keycode.Enter) {
                                                    this.editColumnClickHandler();
                                                    return true;
                                                }
                                                else if (keyCode === Keycode.Delete) {
                                                    this.deleteColumnClickHandler();
                                                    return true;
                                                }
                                                else
                                                    return false;
                                            }}
                                        >
                                            <GridColumn headerText="PK" getText={this.pkColumnCompute} align="center"
                                                        width={40} pinned/>
                                            <GridColumn headerText="Колонка" datafield="name" pinned fontWeight="500"/>
                                            <GridColumn headerText="Тип данных" getText={this.dataTypeColumnCompute}/>
                                            <GridColumn headerText="Not null" width={70} align="center"
                                                        getText={(row: ISchemaTableColumnProps) => row.notNull ? "not null" : ""}/>
                                            <GridColumn headerText="Описание" datafield="description"/>
                                        </Grid>
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
                                                onClick={this.editColumnClickHandler}
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
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
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
                </FlexHPanel>


            </Window>

        )
    }

}
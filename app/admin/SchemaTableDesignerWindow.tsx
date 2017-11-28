import * as  React from "react";

import {IWindowProps, Window} from "../ui/Window";
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
import {clone} from "ejson";
import {Keycode} from "../utils/Keycode";
import {loadSchemaObjectFiles} from "./api/loadSchemaObjectFiles";
import {ISavedSchemaObjectFiles, saveSchemaObjectFiles} from "./api/saveSchemaObjectFiles";
import {getErrorWindow, showError} from "../ui/modals/showError";
import {ISchemaTableColumnProps, ISchemaTableProps, SchemaTable} from "../schema/table/SchemaTable";
import {appState} from "../AppState";
import {StringSqlDataType} from "../schema/table/datatypes/StringSqlDataType";
import {getConfirmation} from "../ui/modals/getConfirmation";


export interface ISchemaTableDesignerProps {
    tableId?: string;
    window?: IWindowProps;
}

export class SchemaTableDesignerWindow extends React.Component<ISchemaTableDesignerProps, any> {

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
    };

    editColumnClickHandler = async () => {
        let columnIndex = this.columnsGrid.getSelectedRowIndex();
        if (columnIndex < 0) {
            await showError("колонка не выбрана");
            return;
        }

        let editedColumn = clone(this.tableColumnsArray.get(columnIndex));

        let resultOk = await this.window.openParentWindow(
            <SchemaTableColumnEditorWindow
                table={this.table}
                column={editedColumn}
                window={{height: 500, width: 600}}
            />
        );
        if (resultOk) {
            this.tableColumnsArray.set(columnIndex, editedColumn);
        }
    };

    deleteColumnClickHandler = async () => {
        let columnIndex = this.columnsGrid.getSelectedRowIndex();
        if (columnIndex < 0) {
            await showError("колонка не выбрана");
            return;
        }

        let editedColumn = clone(this.tableColumnsArray.get(columnIndex));

        let confirmed = await getConfirmation("Удалить колонку '" + editedColumn.name + "'?", "Удаление", "Удалить", "Отмена");

        if (confirmed) {
            this.tableColumnsArray.splice(columnIndex, 1);
            this.columnsGrid.selectRow(Math.min(columnIndex, this.tableColumnsArray.length - 1));
        }
    };

    error: any;
    errorTitle: string;
    table: ISchemaTableProps;
    tableColumnsArray: any;

    async componentDidMount() {

        try {
            let res = await loadSchemaObjectFiles(this.props.tableId!);

            if (res.json) {
                this.table = JSON.parse(res.json);
                this.tableColumnsArray = new ($ as any).jqx.observableArray(this.table.columns);
            }
            else {
                this.error = "не найден объект: " + this.props.tableId;
            }

            let result = new SchemaTable(this.table).validate();
            //debugger
            if (result.error) {
                this.errorTitle = "Ошибка загрузки файла";
                throw result.error;
            }

            this.forceUpdate();

        }
        catch (error) {
            this.error = error;
            this.forceUpdate();
        }

    }

    handleClickSaveButton = async () => {

        this.table.columns = this.tableColumnsArray.toArray();

        let req: ISavedSchemaObjectFiles = {
            filePath: this.props.tableId!,
            json: JSON.stringify(this.table)
        };

        try {
            await saveSchemaObjectFiles(req);
            this.window.close(true);
        }
        catch (err) {
            showError(err.toString());
        }

    };

    handleClickCloseButton = async () => {
        this.window.close();
    };

    window: Window;
    columnsGrid: Grid;

    dataTypeColumnCompute = (row: ISchemaTableColumnProps): string => {
        let dt = appState.sqlDataTypes[row.dataType.id];
        return dt.getName(row.dataType);
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
                title={"таблица: " + this.props.tableId}
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
                                        <FormPanel bindObj={this.table}>

                                            <Input
                                                title="имя"
                                                bindObj={this.table}
                                                bindProp="name"
                                                placeHolder="имя таблицы"
                                                validator={validator}
                                            />

                                            <Input title="описание" bindProp="description"
                                                   placeHolder="введите sql имя таблицы"/>

                                            <Input width={400} bindProp="note" placeHolder="note"
                                                   title={<span style={{color: "red"}}>SchemaObject:</span>}/>
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
                                            <GridColumn text="Колонка" datafield="name"/>
                                            <GridColumn text="Тип данных" compute={this.dataTypeColumnCompute}/>
                                            <GridColumn text="Описание" datafield="description"/>
                                        </Grid>
                                    </FlexItem>
                                    <FlexItem dock="bottom" style={{paddingTop: 8, paddingBottom: 10}}>
                                        <Button imgSrc="vendor/fugue/plus.png"
                                                text="Добавить колонку"
                                                tooltip="добавить новую колонку (ESC)"
                                                height={26}
                                                style={{marginRight: 5}}
                                                onClick={this.addColumnClickHandler}
                                        />
                                        <Button imgSrc="vendor/fugue/card--pencil.png"
                                                text="Изменить"
                                                tooltip="редактировать колонку (ENTER)"
                                                height={26}
                                                style={{marginRight: 5}}
                                                onClick={this.editColumnClickHandler}
                                        />
                                        <Button imgSrc="vendor/fugue/cross.png"
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
                        <Button imgSrc="vendor/fugue/disk.png"
                                text="Сохранить"
                                style={{marginRight: 5}}
                                ref={(e) => this.saveButton = e!}
                                onClick={this.handleClickSaveButton}/>
                        <Button imgSrc="vendor/fugue/cross-script.png"
                                text="Отмена"
                                ref={(e) => this.closeButton = e!}
                                onClick={this.handleClickCloseButton}/>
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )
    }

}
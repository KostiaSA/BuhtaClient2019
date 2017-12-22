import * as  React from "react";

import {Window} from "../ui/Window";
import {omit} from "../utils/omit";
import {FormPanel} from "../ui/FormPanel";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {Grid} from "../ui/Grid";
import {GridColumn} from "../ui/GridColumn";
import {Button} from "../ui/Button";
import {Keycode} from "../utils/Keycode";
import {loadSchemaObjectFiles} from "./api/loadSchemaObjectFiles";
import {getErrorWindow, showError} from "../ui/modals/showError";
import {ISchemaTableColumnProps, ISchemaTableProps, SchemaTable} from "../schema/table/SchemaTable";
import {appState} from "../AppState";
import {config} from "../config";
import {ISchemaObjectDesignerProps, SchemaObjectBaseDesignerWindow} from "./SchemaObjectBaseDesignerWindow";
import {XJSON_parse} from "../utils/xjson";
import {throwError} from "../utils/throwError";


export interface ISchemaTableDesignerProps extends ISchemaObjectDesignerProps {
    //tableId?: string;
    //window?: IWindowProps;
}

export class SchemaQueryDesignerAddFieldsWindow extends SchemaObjectBaseDesignerWindow {

    saveButton: Button;
    closeButton: Button;
    error: any;
    errorTitle: string;
    table: ISchemaTableProps;
    tableColumnsArray: any;
    window: Window;
    columnsGrid: Grid;
    form: FormPanel;

    async componentDidMount() {


        if (this.props.objectId) { // редактирование таблицы

            try {
                let res = await loadSchemaObjectFiles(this.props.objectId!);

                if (res.json) {
                    this.table = XJSON_parse(res.json);
                    this.table.objectId = this.props.objectId;

                    this.table.columns.push({
                        name: "inline SQL:Строка",
                        inlineSql:"'inline sql строка'",
                        dataType: {
                            id: "String",
                            maxLen: 0
                        } as any,
                        description: "вычисляемое поле"
                    });

                    this.table.columns.push({
                        name: "inline SQL:Деньги",
                        inlineSql:"999",
                        dataType: {
                            id: "Money"
                        } as any,
                        description: "вычисляемое поле"
                    });

                    this.tableColumnsArray = new ($ as any).jqx.observableArray(this.table.columns);
                }
                else {
                    this.error = "не найден объект: " + this.props.objectId;
                }

                let result = new SchemaTable(this.table).validate();
                if (result) {
                    this.errorTitle = "Ошибка загрузки файла";
                    throwError( result);
                }

                this.forceUpdate();

            }
            catch (error) {
                this.error = error;
                this.forceUpdate();
            }
        }
        else {
            this.error = "objectId не заполнен";
        }

    }

    handleClickSaveButton = async () => {
        let selectedRows = this.columnsGrid.getSelectedRows();
        if (selectedRows.length === 0) {
            await showError("ничего не выбрано");
            return;
        }
        this.window.close(selectedRows);

        // this.table.columns = this.tableColumnsArray.toArray();
        //
        // let validator = new SchemaTable(this.table).getValidator();
        //
        // let validationError = joiValidate(this.table, validator);
        //
        // if (validationError) {
        //     await showError(validationError);
        //     return
        // }
        //
        // new SchemaObject(this.table).setChangedUserAndDate();
        // let fielPath = this.props.objectId || this.props.newObjectPath + "/" + this.table.name + "." + SchemaTable.objectType;
        // delete this.table.objectId;
        //
        // let req: ISavedSchemaObjectFiles = {
        //     filePath: fielPath,
        //     json: XJSON_stringify(this.table)
        // };
        //
        // try {
        //     await saveSchemaObjectFiles(req);
        //     this.window.close(req.filePath);
        // }
        // catch (err) {
        //     showError(err.toString());
        // }

    };

    handleClickCloseButton = async () => {
        this.window.close();
    };


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


    render() {

        if (this.error) {
            return getErrorWindow(this.error, this.errorTitle);
        }

        if (!this.table)
            return null;

        let validator = new SchemaTable(this.table).getValidator();

        //console.log("render SchemaTableDesignerWindow");
        return (
            <Window
                {...omit(this.props.window, ["children"])}
                storageKey="SchemaTableDesignerWindow"
                title={this.props.objectId ? "таблица: " + this.props.objectId : "новая таблица в \"" + this.props.newObjectPath + "\""}
                icon="vendor/fugue/table.png"
                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    <FlexItem dock="top">
                        фильтр по названию
                    </FlexItem>
                    <FlexItem dock="fill" style={{padding: 5}}>
                        <Grid
                            ref={(e) => {
                                this.columnsGrid = e!
                            }}
                            checkboxes
                            source={this.tableColumnsArray}
                            onRowKeyDown={(rowIndex, keyCode) => {
                                if (keyCode === Keycode.Insert) {
                                    //this.addColumnClickHandler();
                                    return true;
                                }
                                else if (keyCode === Keycode.Enter) {
                                    //this.editColumnClickHandler();
                                    return true;
                                }
                                else if (keyCode === Keycode.Delete) {
                                    //this.deleteColumnClickHandler();
                                    return true;
                                }
                                else
                                    return false;
                            }}
                        >
                            <GridColumn headerText="PK" getText={this.pkColumnCompute} align="center"
                                        width={40}/>
                            <GridColumn headerText="Колонка" datafield="name" fontWeight="500"/>
                            <GridColumn headerText="Тип данных" getText={this.dataTypeColumnCompute}/>
                            <GridColumn headerText="Описание" datafield="description"/>
                        </Grid>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        <Button imgSrc={config.button.okIcon}
                                text="Добавить в запрос"
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
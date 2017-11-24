import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {TabsPanel} from "../ui/TabsPanel";
import {TabsPanelItem} from "../ui/TabsPanelItem";
import {omit} from "../utils/omit";
import {FormPanel} from "../ui/FormPanel";
import {FormPanelItem} from "../ui/FormPanelItem";
import {Input} from "../ui/inputs/Input";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {Grid} from "../ui/Grid";
import {GridColumn} from "../ui/GridColumn";
import {Button} from "../ui/Button";
import {SchemaTableColumnEditorWindow} from "./SchemaTableColumnEditorWindow";
import {clone} from "ejson";
import {Keycode} from "../utils/Keycode";
import {ISchemaTableProps} from "../schema/table/ISchemaTableProps";
import {loadSchemaObjectFiles} from "./api/loadSchemaObjectFiles";
import {ISavedSchemaObjectFiles, saveSchemaObjectFiles} from "./api/saveSchemaObjectFiles";
import {getErrorWindow} from "../ui/modals/showError";


export interface ISchemaTableDesignerProps {
    tableId?: string;
    window?: IWindowProps;
}

export class SchemaTableDesignerWindow extends React.Component<ISchemaTableDesignerProps, any> {

    saveButton: Button;
    closeButton: Button;

    editColumnClickHandler = async () => {
        let columnIndex = this.columnsGrid.getSelectedRowIndex();

        let editedColumn = clone(this.tableColumnsArray.get(columnIndex));

        let resultOk = await this.window.openParentWindow(
            <SchemaTableColumnEditorWindow
                table={this.table}
                column={editedColumn}
                window={{height: 300, width: 400}}
            />
        );
        if (resultOk) {
            this.tableColumnsArray.set(columnIndex, editedColumn);
        }
    };

    error: string;
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
            this.forceUpdate();

        }
        catch (error) {
            this.error = error.toString();
            this.forceUpdate();
        }

    }

    handleClickSaveButton = async () => {

        this.table.columns = this.tableColumnsArray.toArray();

        let req: ISavedSchemaObjectFiles = {
            filePath: this.props.tableId!,
            json: JSON.stringify(this.table)
        };

        this.saveButton.disable();
        this.closeButton.disable();
        try {
            await saveSchemaObjectFiles(req);
            this.window.close(true);
        }
        catch (err) {
            this.saveButton.enable();
            this.closeButton.enable();
            alert(err.toString());
        }

    };

    handleClickCloseButton = async () => {
        this.window.close();
    };

    window: Window;
    columnsGrid: Grid;


    render() {

        if (this.error) {
            return getErrorWindow(this.error);
            //return <Window title="Ошибка"><span style={{color: "red"}}>ошибка: {this.error}</span></Window>
        }

        if (!this.table)
            return null;

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
                                    <FlexItem dock="top" style={{padding: 5}}>
                                        таблица контент ЗАГОЛОВОК
                                    </FlexItem>
                                    <FlexItem dock="fill" style={{padding: 5}}>
                                        <FormPanel bindObj={this.table}>
                                            <FormPanelItem title="имя">
                                                <Input bindObj={this.table} bindProp="name" placeHolder="имя таблицы"/>
                                            </FormPanelItem>
                                            <FormPanelItem title="описание">
                                                <Input bindProp="description" placeHolder="введите sql имя таблицы"/>
                                            </FormPanelItem>
                                            <Input width={400} bindProp="note" placeHolder="note"
                                                   title={<span style={{color: "red"}}>SchemaObject:</span>}/>
                                        </FormPanel>
                                    </FlexItem>
                                    <FlexItem dock="top" style={{padding: 5}}>
                                        таблица контент ФУТТЕР
                                    </FlexItem>
                                </FlexHPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="Колонки">
                                <FlexHPanel>
                                    <FlexItem dock="top" style={{padding: 5}}>
                                        фильтр по названию
                                    </FlexItem>
                                    <FlexItem dock="fill" style={{padding: 5}}>
                                        <Grid
                                            ref={(e) => {
                                                this.columnsGrid = e!
                                            }}
                                            source={this.tableColumnsArray}
                                            onRowDoubleClick={this.editColumnClickHandler}
                                            onRowKeyDown={(rowIndex, keyCode) => {
                                                if (keyCode === Keycode.Enter) {
                                                    this.editColumnClickHandler();
                                                    return true;
                                                }
                                                else
                                                    return false;
                                            }}
                                        >
                                            <GridColumn text="Колонка" datafield="name"/>
                                            <GridColumn text="Описание" datafield="description"/>
                                        </Grid>
                                    </FlexItem>
                                    <FlexItem dock="bottom" style={{padding: 5, height: 38}}>
                                        <Button imgSrc="vendor/fugue/plus.png" text="Добавить колонку" height={26}
                                                style={{marginRight: 5, marginTop: 8}}/>
                                        <Button imgSrc="vendor/fugue/card--pencil.png" text="Изменить" height={26}
                                                style={{marginRight: 5, marginTop: 8}}
                                                onClick={() => this.editColumnClickHandler()}/>
                                        <Button imgSrc="vendor/fugue/cross.png" text="Удалить" height={26}
                                                style={{marginRight: 5, marginTop: 8}}/>
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
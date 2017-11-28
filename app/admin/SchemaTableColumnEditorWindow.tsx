import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {TabsPanel} from "../ui/TabsPanel";
import {TabsPanelItem} from "../ui/TabsPanelItem";
import {omit} from "../utils/omit";
import {FormPanel} from "../ui/FormPanel";
import {Input} from "../ui/inputs/Input";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {Button} from "../ui/Button";
import {ISchemaTableColumnProps, ISchemaTableProps, SchemaTable} from "../schema/table/SchemaTable";
import {ComboBox} from "../ui/inputs/ComboBox";
import {appState} from "../AppState";
import {StringSqlDataType} from "../schema/table/datatypes/StringSqlDataType";
import {config} from "../const/config";


export interface ISchemaTableColumnEditorProps {
    table?: ISchemaTableProps;
    column?: ISchemaTableColumnProps;
    window?: IWindowProps;
}

export class SchemaTableColumnEditorWindow extends React.Component<ISchemaTableColumnEditorProps, any> {

    window: Window;

    form1: FormPanel | null;

    getDataTypesSource(): any[] {
        let ret: any[] = [];
        for (let dataTypeId in appState.sqlDataTypes) {
            ret.push({id: dataTypeId, name: appState.sqlDataTypes[dataTypeId].getName()});
        }
        return ret;
    }

    renderDataTypeEditors(): React.ReactNode {
        let ret: React.ReactNode[] = [];
        for (let dataTypeId in appState.sqlDataTypes) {
            let dt = appState.sqlDataTypes[dataTypeId];
            ret.push(dt.renderPropsEditors(this.props.column!.dataType));
        }
        return ret;
    }

    handleDataTypeChange = async () => {
        // let col = this.props.column!;
        // let dt = appState.sqlDataTypes[col.dataType.id];
        // dt.setDefaultProps(col.dataType);
        this.forceUpdate();
        //console.log("handleDataTypeChange");
    };

    render() {
        console.log("SchemaTableColumnEditorWindow");
        let col = this.props.column!;
        if (!col.dataType) {
            col.dataType = {} as any;
        }
        if (!col.dataType.id) {
            col.dataType.id = StringSqlDataType.id;
            // let dt = appState.sqlDataTypes[StringSqlDataType.id];
            // dt.setDefaultProps(col.dataType);
        }

        let validator = new SchemaTable(this.props.table!).getColumnValidator();

        return (
            <Window
                {...omit(this.props.window, ["children"])}
                title={"колонка: " + this.props.column!.name}
                icon="vendor/fugue/table-insert-column.png"

                ref={(e) => {
                    this.window = e!
                }}>
                {/*Дизайнер колонки {this.props.ta??bleId}*/}

                <FlexHPanel>
                    <FlexItem dock="top">
                        таблица: XXX
                    </FlexItem>
                    <FlexItem dock="fill">
                        <TabsPanel>

                            <TabsPanelItem title="Колонка" style={{}}>
                                <FormPanel
                                    ref={(e) => this.form1 = e}
                                    bindObj={this.props.column}
                                    validator={validator}
                                >
                                    <Input title="имя" bindProp="name" placeHolder="имя колонки" width={300}/>
                                    <Input title="описание" bindProp="description" placeHolder="описание колонки"
                                           width={400}/>
                                    <ComboBox
                                        title="тип данных sql"
                                        bindProp="dataType.id"
                                        placeHolder="тип данных"
                                        valueMember="id"
                                        displayMember="name"
                                        source={this.getDataTypesSource()}
                                        onChange={this.handleDataTypeChange}
                                    />
                                    {this.renderDataTypeEditors()}
                                </FormPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="В списках">
                                <FlexHPanel>
                                    <FlexItem dock="top" style={{padding: 5}}>
                                        фильтр по названию
                                    </FlexItem>
                                    <FlexItem dock="fill" style={{padding: 5}}>
                                    </FlexItem>
                                    <FlexItem dock="bottom" style={{padding: 5, height: 38}}>
                                    </FlexItem>
                                </FlexHPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="В формах">
                                индексы контент
                            </TabsPanelItem>

                        </TabsPanel>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        <Button
                            imgSrc={config.button.saveIcon}
                            text="Сохранить"
                            style={{marginRight: 5}}
                            onClick={async () => {

                                // удаление лишних props
                                let dt = appState.sqlDataTypes[this.props.column!.dataType.id];
                                this.props.column!.dataType = dt.copyProps(this.props.column!.dataType);

                                this.window.close(true);
                            }}
                        />
                        <Button
                            imgSrc={config.button.cancelIcon}
                            text="Отмена"
                            onClick={async () => {
                                //this.form1!.cancelChanges();
                                this.window.close(false);
                            }}
                        />
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )
    }

}
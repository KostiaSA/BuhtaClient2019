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
import {ISchemaTableColumnProps, ISchemaTableProps} from "../schema/table/SchemaTable";
import {ComboBox} from "../ui/inputs/ComboBox";
import {appState} from "../AppState";


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
        console.log("ret===========", ret);
        return ret;
    }

    render() {
        console.log("SchemaTableColumnEditorWindow");
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

                            <TabsPanelItem title="Колонка">
                                <FormPanel
                                    ref={(e) => this.form1 = e}
                                    bindObj={this.props.column}
                                >
                                    <Input title="name" bindProp="name" placeHolder="имя колонки" width={300}/>
                                    <Input title="описание" bindProp="description" placeHolder="описание колонки"
                                           width={400}/>
                                    <ComboBox
                                        title="тип данных"
                                        bindProp="dataType.id"
                                        placeHolder="тип данных"
                                        valueMember="id"
                                        displayMember="name"
                                        source={this.getDataTypesSource()}
                                    />
                                </FormPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="XXX">
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

                            <TabsPanelItem title="YYY">
                                индексы контент
                            </TabsPanelItem>

                        </TabsPanel>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        <Button
                            imgSrc="vendor/fugue/disk.png" text="Сохранить"
                            style={{marginRight: 5}}
                            onClick={async () => {

                                // удаление лишних props
                                let dt = appState.sqlDataTypes[this.props.column!.dataType.id];
                                this.props.column!.dataType = dt.copyProps(this.props.column!.dataType);

                                this.window.close(true);
                            }}
                        />
                        <Button
                            imgSrc="vendor/fugue/cross-script.png"
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
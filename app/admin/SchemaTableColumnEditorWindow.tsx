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
import {Button} from "../ui/Button";
import {ISchemaTableProps} from "../schema/table/ISchemaTableProps";
import {ISchemaTableColumnProps} from "../schema/table/ISchemaTableColumnProps";


export interface ISchemaTableColumnEditorProps {
    table?: ISchemaTableProps;
    column?: ISchemaTableColumnProps;
    window?: IWindowProps;
}

export class SchemaTableColumnEditorWindow extends React.Component<ISchemaTableColumnEditorProps, any> {

    window: Window;

    form1: FormPanel | null;

    render() {
        console.log("SchemaTableColumnEditorWindow");
        return (
            <Window
                {...omit(this.props.window, ["children"])}
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
                                    <FormPanelItem title="name">
                                        <Input bindProp="name" placeHolder="имя колонки"/>
                                    </FormPanelItem>
                                    <FormPanelItem title="описание">
                                        <Input bindProp="description" placeHolder="описание колонки"/>
                                    </FormPanelItem>
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
                            imgSrc="vendor/fugue/icons/disk.png" text="Сохранить"
                            style={{marginRight: 5}}
                            onClick={async () => {
                                this.window.close(true);
                            }}
                        />
                        <Button
                            imgSrc="vendor/fugue/icons/cross-script.png"
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
import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {TabsPanel} from "../ui/TabsPanel";
import {TabsPanelItem} from "../ui/TabsPanelItem";
import {omit} from "../utils/omit";
import {FormPanel} from "../ui/FormPanel";
import {FormPanelItem} from "../ui/FormPanelItem";
import {Input} from "../ui/inputs/Input";


export interface ISchemaTableDesignerProps {
    tableId?: string;
    window?: IWindowProps;
}

export class SchemaTableDesignerWindow extends React.Component<ISchemaTableDesignerProps, any> {
    table: any = {name: "Организация", sqlName: "_Организация_", note:"это такая таблица"};

    render() {
        console.log("SchemaTableDesignerWindow");
        // let props=this.props.window || {};
        // delete props.children;
        //<Window {...this.props.window}>
        return (
            <Window {...omit(this.props.window, ["children"])}>
                {/*Дизайнер таблицы {this.props.tableId}*/}
                <TabsPanel height="100%">
                    <TabsPanelItem title="Таблица">
                        таблица контент
                        <FormPanel>
                            <FormPanelItem title="имя">
                                <Input bindObj={this.table} bindProp="name" placeHolder="имя таблицы"/>
                            </FormPanelItem>
                            <FormPanelItem title="sql-имя">
                                <Input bindObj={this.table} bindProp="sqlName" placeHolder="введите sql имя таблицы"/>
                            </FormPanelItem>
                            <Input bindObj={this.table} width={400} bindProp="note" placeHolder="note" title={<span style={{color:"red"}}>силу пробуджувати й очищувати </span>}/>
                        </FormPanel>
                    </TabsPanelItem>
                    <TabsPanelItem title="Колонки">
                        колонки контент
                    </TabsPanelItem>
                    <TabsPanelItem title="Индексы">
                        индексы контент
                    </TabsPanelItem>
                </TabsPanel>
            </Window>

        )
    }

}
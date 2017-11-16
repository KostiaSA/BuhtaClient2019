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

    render() {
        console.log("SchemaTableDesignerWindow");
        // let props=this.props.window || {};
        // delete props.children;
        //<Window {...this.props.window}>
        return (
            <Window {...omit(this.props.window,["children"])}>
                {/*Дизайнер таблицы {this.props.tableId}*/}
                <TabsPanel height="100%">
                    <TabsPanelItem title="Таблица">
                        таблица контент
                        <FormPanel>
                            <FormPanelItem title="имя">
                                <Input placeHolder="имя таблицы"/>
                            </FormPanelItem>
                            <FormPanelItem title="sql-имя">
                                <Input placeHolder="введите sql имя таблицы"/>
                            </FormPanelItem>
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
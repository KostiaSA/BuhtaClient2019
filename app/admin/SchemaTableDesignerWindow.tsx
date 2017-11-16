import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {TabsPanel} from "../ui/TabsPanel";
import {TabsPanelItem} from "../ui/TabsPanelItem";


export interface ISchemaTableDesignerProps {
    tableId?: string;
    window?: IWindowProps;
}

export class SchemaTableDesignerWindow extends React.Component<ISchemaTableDesignerProps, any> {

    render() {
        console.log("SchemaTableDesignerWindow");
        let props=this.props.window || {};
        delete props.children;
        //<Window {...this.props.window}>
        return (
            <Window {...this.props.window}>
                {/*Дизайнер таблицы {this.props.tableId}*/}
                <TabsPanel height="100%">
                    <TabsPanelItem title="Таблица">
                        таблица контент
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
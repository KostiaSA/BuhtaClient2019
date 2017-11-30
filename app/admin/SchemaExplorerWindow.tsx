import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {omit} from "../utils/omit";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {ISchemaTableColumnProps, ISchemaTableProps} from "../schema/table/SchemaTable";
import {Tree} from "../ui/Tree";
import {loadSchemaTree} from "./api/loadSchemaTree";


export interface ISchemaTableColumnEditorProps {
    table?: ISchemaTableProps;
    column?: ISchemaTableColumnProps;
    window?: IWindowProps;
}

export class SchemaExplorerWindow extends React.Component<ISchemaTableColumnEditorProps, any> {

    window: Window;
    objectsTree: any;
    error: any;

    private preprocessDataSource(item: any, level: number, path: string) {
        item.label = item.name;

        if (level === 0)
            item.fileName = "";
        else if (path === "")
            item.fileName = item.name;
        else
            item.fileName = path + "/" + item.name;

        if (item.items) {
            item.label = item.name;
            item.expanded = true;
            item.icon = "vendor/fugue/folder-horizontal.png";
            item.items.forEach(((child: any) => this.preprocessDataSource(child, level + 1, item.fileName)))
        }
        else {
            // убираем .json
            item.label = item.name.slice(0, -5);
        }
    }

    async componentDidMount() {

        try {
            let res = await loadSchemaTree();
            this.preprocessDataSource(res, 0, "");
            this.objectsTree = res.items;
            console.log("this.objectsTree", this.objectsTree);
            this.forceUpdate();
        }
        catch (error) {
            this.error = error;
            this.forceUpdate();
        }

    }

    render() {
        console.log("SchemaExplorerWindow");
        if (!this.objectsTree)
            return null;

        return (
            <Window
                {...omit(this.props.window, ["children"])}
                title={"Объекты конфигурации"}
                icon="vendor/fugue/sitemap-application-blue.png"

                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    <FlexItem dock="top">
                        шапка
                    </FlexItem>
                    <FlexItem dock="fill">
                        <Tree source={this.objectsTree}/>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        подвал
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )
    }

}
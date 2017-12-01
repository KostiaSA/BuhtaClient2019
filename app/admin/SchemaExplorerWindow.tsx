import * as  React from "react";
import {CSSProperties} from "react";
import * as ReactDOMServer from 'react-dom/server';
import {IWindowProps, Window} from "../ui/Window";
import {omit} from "../utils/omit";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {ISchemaTableColumnProps, ISchemaTableProps} from "../schema/table/SchemaTable";
import {Tree} from "../ui/Tree";
import {loadSchemaTree} from "./api/loadSchemaTree";
import {appState} from "../AppState";
import {getErrorWindow} from "../ui/modals/showError";
import {SchemaObject} from "../schema/SchemaObject";
import {config} from "../const/config";
import {Button} from "../ui/Button";


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
        let itemStr = item.name;

        if (level === 0)
            item.fileName = "";
        else if (path === "")
            item.fileName = item.name;
        else
            item.fileName = path + "/" + item.name;

        item.id = item.fileName;

        let style: CSSProperties = {};

        if (item.items) {
            itemStr = item.name;
            item.expanded = true;
            item.icon = "vendor/fugue/folder-horizontal.png";
            item.items.forEach(((child: any) => this.preprocessDataSource(child, level + 1, item.fileName)));
            item.objectType = "folder";
            style.fontWeight = "bold";
            style.color = "#505050eb";
        }
        else {

            //item.objectType = itemStr.split(".").pop();
            item.objectType = SchemaObject.getObjectTypeFromFileName(item.name);

            if (item.objectType && appState.schemaObjectTypes[item.objectType])
                item.icon = appState.schemaObjectTypes[item.objectType].icon;

            // убираем .json
            itemStr = item.name.slice(0, -5);
        }


        item.html = ReactDOMServer.renderToStaticMarkup(
            <span style={style}>
                {itemStr}
            </span>
        );

        //console.log("item.label",item.label);
    }

    async componentDidMount() {

        try {
            let res = await loadSchemaTree();
            this.preprocessDataSource(res, 0, "");
            this.objectsTree = res.items;
            //console.log("this.objectsTree", this.objectsTree);
            this.forceUpdate();
        }
        catch (error) {
            this.error = error;
            this.forceUpdate();
        }

    }

    async handleOpenObjectDesigner(objectFileName: string) {
        let objectType = SchemaObject.getObjectTypeFromFileName(objectFileName);
        if (!appState.schemaObjectTypes[objectType])
            throw "неверный тип объекта '" + objectType + "'";
        let DesignerWindow = appState.schemaObjectTypes[objectType].designerWindow;

        appState.desktop.openWindow(
            <DesignerWindow
                window={{id: "дизайнер:" + objectFileName, height: 444, width: 600}}
                objectId={objectFileName}>
            </DesignerWindow>
        );

    }

    render() {
        console.log("SchemaExplorerWindow");

        if (this.error) {
            return getErrorWindow(this.error);
        }

        if (!this.objectsTree)
            return null;


        return (
            <Window
                {...omit(this.props.window, ["children"])}
                height={600}
                title={"Объекты конфигурации"}
                icon="vendor/fugue/sitemap-application-blue.png"

                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    <FlexItem dock="top">
                        шапка
                    </FlexItem>
                    <FlexItem dock="fill" style={{padding: 5}}>
                        <Tree
                            source={this.objectsTree}
                            onItemDblClick={async (item) => {
                                this.handleOpenObjectDesigner(item.id);
                                console.log("=======================")
                            }}
                        />
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        <Button imgSrc={config.button.cancelIcon}
                                text="Закрыть"
                                onClick={async ()=>{this.window.close()}}/>
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )

    }

}
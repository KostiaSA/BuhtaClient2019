import * as  React from "react";
import {CSSProperties} from "react";
import {Window} from "../ui/Window";
import {omit} from "../utils/omit";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {getErrorWindow} from "../ui/modals/showError";
import {config} from "../const/config";
import {Button} from "../ui/Button";
import {MenuItem} from "../ui/MenuItem";
import {Menu} from "../ui/Menu";
import {getRandomString} from "../utils/getRandomString";
import {MenuSeparator} from "../ui/MenuSeparator";
import {ITreeGridSource, TreeGrid} from "../ui/TreeGrid";
import {TreeGridColumn} from "../ui/TreeGridColumn";
import {loadTests} from "./api/loadTests";
import {FlexVPanel} from "../ui/FlexVPanel";
import {sleep} from "../utils/sleep";


export class TestsExplorerWindow extends React.Component<any> {

    window: Window;
    treeGridSource: ITreeGridSource;
    error: any;

    private preprocessDataSource(item: any, level: number, path: string) {
        let itemStr = item.name;

        if (level === 0)
            item.fileName = "";
        else if (path === "")
            item.fileName = item.name;
        else
            item.fileName = path + "/" + item.name;

        //item.id = "test_" + getSHA1hex(item.fileName);
        //item.value = item.fileName;

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
            //item.icon = "vendor/fugue/tick-white.png";
            item.icon = "vendor/fugue/fruit-lime.png";

            // //item.objectType = itemStr.split(".").pop();
            // item.objectType = SchemaObject.getObjectTypeFromFileName(item.name);
            //
            // if (item.objectType && appState.schemaObjectTypes[item.objectType])
            //     item.icon = appState.schemaObjectTypes[item.objectType].icon;
            //
            // // убираем .json
            if (item.name.endsWith(".test.jsx"))
                item.name = item.name.slice(0, -9);
        }


        // item.html = ReactDOMServer.renderToStaticMarkup(
        //     <span style={style}>
        //         {itemStr}
        //     </span>
        // );

        //console.log("item.label",item.label);
    }

    async componentDidMount() {

        try {
            let res = await loadTests();
            this.preprocessDataSource(res, 0, "");
            this.treeGridSource = {
                localData: res.items,
                dataType: "json",
                id: "fileName",
                hierarchy: {
                    root: "items"
                },
                // dataFields: [
                //     {name: "name", type: "string"},
                // ]
            };

            //console.log("this.objectsTree", this.objectsTree);
            this.forceUpdate();
        }
        catch (error) {
            this.error = error;
            this.forceUpdate();
        }

    }

    async handleOpenObjectDesigner(objectFileName: string) {
        // let objectType = SchemaObject.getObjectTypeFromFileName(objectFileName);
        // if (!appState.schemaObjectTypes[objectType])
        //     throw "неверный тип объекта '" + objectType + "'";
        // let DesignerWindow = appState.schemaObjectTypes[objectType].designerWindow;
        //
        // appState.desktop.openWindow(
        //     <DesignerWindow
        //         window={{id: "дизайнер:" + objectFileName, height: 444, width: 600}}
        //         objectId={objectFileName}>
        //     </DesignerWindow>
        // );

    }

    createPopupMenu = async (rowItem: any) => {

        if (rowItem.hasItems) {
            return (
                <Menu mode="popup" key={getRandomString()}>
                    <MenuItem
                        title="Выполнить все тесты"
                        onClick={async () => {
                            //this.handleOpenTableDesigner_for_create(rowItem);
                        }}>
                    </MenuItem>
                </Menu>
            )
        }
        else
            return (
                <Menu mode="popup" key={getRandomString()}>
                    <MenuItem title="Выполнить тест" icon={config.button.cancelIcon}></MenuItem>
                    <MenuSeparator/>
                    <MenuItem title="Открыть исходный текст" icon={config.button.cancelIcon}></MenuItem>
                </Menu>
            )
    };

    treeGrid: TreeGrid;

    testedItems: {
        name: string,
        level: number,
        result: "run" | "ok" | "error",
    }[] = [];

    async runTests() {
        console.log("this.treeGrid.getCheckedRows--------------------------->", this.treeGrid.getCheckedRows());
        this.testedItems = [];
        for (let item of this.treeGrid.getCheckedRows()) {
            let testedItem: any = {
                name: item.name,
                level: item.level,
                result: "folder"
            };
            this.testedItems.push(testedItem);
            if (!item.items) {
                testedItem.result = "run";
                this.forceUpdate();
                // выполняем тест
                await sleep(500);
            }
            this.forceUpdate();
        }
    }

    render() {
        console.log("TestsExplorerWindow");

        if (this.error) {
            return getErrorWindow(this.error);
        }

        if (!this.treeGridSource)
            return null;


        return (
            <Window
                {...omit(this.props.window, ["children"])}
                storageKey="TestsExplorerWindow"
                height={600}
                title={"Тесты"}
                icon="vendor/fugue/sitemap-application-blue.png"

                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    {/**************************** шапка с фильтом *************************/}
                    <FlexItem dock="top" resizer="bottom" storageKey="TestsExplorerWindow:topResizer"
                              style={{height: 100, padding: 5}}>
                        шапка
                    </FlexItem>
                    {/**************************** список тестов в виде дерева *************/}
                    <FlexItem dock="fill" style={{padding: 5, paddingBottom: 2}}>
                        <TreeGrid
                            ref={(e: any) => this.treeGrid = e!}
                            source={this.treeGridSource}
                            onRowDoubleClick={async (item) => {
                                //this.handleOpenObjectDesigner(item.value);
                            }}
                            popup={this.createPopupMenu}
                            icons checkboxes hierarchicalCheckboxes
                            enableHover={false}

                        >
                            <TreeGridColumn text="Тест" datafield="name"/>

                        </TreeGrid>
                    </FlexItem>
                    {/**************************** панель с результатами *******************/}
                    <FlexItem dock="bottom" resizer="top" storageKey="TestsExplorerWindow:bottomResizer"
                              style={{height: 150, padding: 5, paddingTop: 0, justifyContent: "flex-end"}}>

                        <div
                            style={{
                                overflow: "auto",
                                padding: 5,
                                border: config.border,
                                height: "100%",
                                width: "100%"
                            }}>
                            {this.testedItems.map((item) => {
                                return <div>{item.name}</div>
                            })}
                        </div>

                    </FlexItem>
                    {/**************************** нижние кнопки ***************************/}
                    <FlexItem dock="bottom" style={{padding: 5, paddingTop: 10 /*justifyContent: "flex-end"*/}}>
                        <FlexVPanel>
                            <FlexItem dock="left">
                                <Button
                                    imgSrc="vendor/fugue/fruit-lime.png"
                                    text="запуск тестов"
                                    onClick={async () => {
                                        this.runTests();
                                    }}
                                />
                            </FlexItem>
                            <FlexItem dock="fill" style={{justifyContent: "flex-end"}}>
                                <Button
                                    imgSrc={config.button.cancelIcon}
                                    text="Закрыть"
                                    onClick={async () => {
                                        this.window.close()
                                    }}
                                />
                            </FlexItem>
                        </FlexVPanel>
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )

    }

}
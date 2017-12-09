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
import {loadTestFile} from "./api/loadTestFile";
import {babelTransform} from "../utils/babelTransform";
import {BaseTest} from "../test/BaseTest";
import {isFunction} from "util";

declare var $$BuhtaTestClassForRun: any;

(window as any).xxx7 = class Test extends BaseTest {

    _localProc() {
        return "ага!"
    }

    async test1() {
        return "ok"
    }

    async test2() {
        throw "";
    }

}

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
            item.icon = "vendor/fugue/fruit-lime.png";

            // убираем .test.jsx
            if (item.name.endsWith(".test.jsx"))
                item.name = item.name.slice(0, -9);
        }

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
        result: "folder" | "run" | "ok" | "error",
        items: {
            name: string,
            result: "run" | "ok" | "error",
            message?: string,
        }[]
    }[] = [];

    async runTests() {
        console.log("this.treeGrid.getCheckedRows--------------------------->", this.treeGrid.getCheckedRows());
        this.testedItems = [];
        for (let item of this.treeGrid.getCheckedRows()) {
            let testedItem: any = {
                name: item.name,
                level: item.level,
                result: "folder",
                items: []
            };
            this.testedItems.push(testedItem);
            if (!item.items) {
                testedItem.result = "run";
                this.forceUpdate();


                // выполняем тест
                let testSourceFile = item.fileName;
                let code = await loadTestFile(testSourceFile);
                code = babelTransform(code);

                //console.log(className, compiledScript);
                code = "window.$$BuhtaTestClassForRun=" + code;
                //loadScript(code);
                eval(code);
                //console.log("$$BuhtaTestClassForRun-------------->", $$BuhtaTestClassForRun);

                let $$testObject = new $$BuhtaTestClassForRun();


                let methodNames = Object.getOwnPropertyNames($$BuhtaTestClassForRun.prototype).filter((name) => !name.startsWith("_") && name !== "constructor");

                for (let name of ["_before", ...methodNames, "_after"]) {
                    let method = $$testObject[name];
                    if (isFunction(method)) {
                        let subItem = {
                            name: name,
                            result: "run",
                            message: ""
                        };

                        if (!name.startsWith("_"))
                            testedItem.items.push(subItem);

                        if (testedItem.result !== "error")
                            testedItem.result = "run";

                        this.forceUpdate();

                        try {
                            await method();
                            subItem.result = "ok";
                        }
                        catch (e) {
                            subItem.result = "error";
                            subItem.message = e.message || e.toString();
                            testedItem.result = "error";
                            if (name.startsWith("_"))
                                testedItem.items.push(subItem);
                        }
                        this.forceUpdate();

                        //console.log("name19***", name, subItem.result);
                    }
                }

                if (testedItem.result !== "error")
                    testedItem.result = "ok";

                this.forceUpdate();
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
                                return (
                                    <div
                                        style={{
                                            marginLeft: item.level * 15,
                                            fontWeight: (item.result === "folder" ? "bold" : undefined)
                                        }}>

                                        <span style={{marginRight: 5}}>{item.name}</span>

                                        <span style={{
                                            display: item.result === "run" ? "inline" : "none",
                                            color: "orange"
                                        }}>
                                            <i className="fa fa-cog fa-spin fa-fw"></i>
                                        </span>
                                        <span style={{
                                            display: item.result === "ok" ? "inline" : "none",
                                            color: "green"
                                        }}>
                                            <i className="fa fa-check"></i>
                                        </span>
                                        <span style={{
                                            display: item.result === "error" ? "inline" : "none",
                                            color: "red"
                                        }}>
                                            <i className="fa fa-exclamation-circle"></i>
                                        </span>
                                        {item.items.map((subItem) => {
                                            return (
                                                <div
                                                    style={{
                                                        marginLeft: 15,
                                                        fontStyle: "italic"
                                                    }}>

                                                    <span style={{marginRight: 5}}>{subItem.name}</span>

                                                    <span style={{
                                                        display: subItem.result === "run" ? "inline" : "none",
                                                        color: "orange"
                                                    }}>
                                                         <i className="fa fa-cog fa-spin fa-fw"></i>
                                                    </span>
                                                    <span style={{
                                                        display: subItem.result === "ok" ? "inline" : "none",
                                                        color: "green"
                                                    }}>
                                                         <i className="fa fa-check"></i>
                                                    </span>
                                                    <span style={{
                                                        display: subItem.result === "error" ? "inline" : "none",
                                                        color: "red"
                                                    }}>
                                                         <i className="fa fa-exclamation-circle"></i>
                                                        <span
                                                            style={{
                                                                marginLeft: 5,
                                                                color: "red"
                                                            }}>{(subItem.message || "").substr(0, 50)}</span>
                                                    </span>
                                                </div>);
                                        })
                                        }
                                    </div>);
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
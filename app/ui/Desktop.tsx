import * as  React from "react";
import {appState} from "../AppState";
import {Window} from "./Window";
import {getRandomString} from "../utils/getRandomString";
import {replaceAll} from "../utils/replaceAll";
import {SchemaTableDesignerWindow} from "../admin/SchemaTableDesignerWindow";
import {IComponentProps} from "./Component";
import {saveSchemaObjectFiles} from "../admin/api/saveSchemaObjectFiles";
import {loadSchemaTree} from "../admin/api/loadSchemaTree";
import {SchemaExplorerWindow} from "../admin/SchemaExplorerWindow";
import {getSHA1hex} from "../utils/getSHA1hex";
import {Menu} from "./Menu";
import {MenuItem} from "./MenuItem";
import {config} from "../config";
import {MenuSeparator} from "./MenuSeparator";
import {TestsExplorerWindow} from "../admin/TestsExplorerWindow";
import {throwError} from "../utils/throwError";
import {Div} from "./Div";
import {IToolbarItemProps, IToolbarProps, Toolbar} from "./Toolbar";


export interface IDesktopProps extends IComponentProps {
    //schemaPageId: string;
    //form: WrappedFormUtils;
}

declare var Babel: any;

export class Desktop extends React.Component<IDesktopProps, any> {

    componentDidMount() {
        appState.desktop = this;
    }

    w: Window;
    b: string = "бутон2";
    t: string = "title999";

    windows: React.ReactNode[] = [];
    toolbarGroups:string[]=[];
    toolbarItems:IToolbarItemProps[]=[];

    renderWindows(): React.ReactNode {
        return this.windows.slice();
    }

    renderToolbar(): React.ReactNode {
        return (
            [
                <img src="vendor/fugue/key.png"/>,
                <img src="vendor/fugue/tick.png"/>,
            ]
        );
    }

    render() {
        //console.log("render desktop");
        return (
            <div id="desktop" style={{height: "100%", flex: "1 0 auto"}}>
                <Menu mode="horizontal">
                    <MenuItem title="Файл">
                        <MenuItem title="Новый Новый" icon={config.button.cancelIcon}></MenuItem>
                        <MenuItem title="Старый 2" onClick={async () => {
                            alert("fuf")
                        }}></MenuItem>
                        <MenuItem title="Старый 333" onClick={async () => {
                            alert("fuf")
                        }}></MenuItem>
                        <MenuSeparator/>
                        <MenuItem title="Старый 33333" onClick={async () => {
                            alert("fuf")
                        }}></MenuItem>
                        <MenuItem title="Старый +++" onClick={async () => {
                            alert("fuf")
                        }}></MenuItem>
                        <MenuItem title="Старый 33333" onClick={async () => {
                            alert("fuf")
                        }}></MenuItem>
                        <MenuItem title="Старый +++" onClick={async () => {
                            alert("fuf")
                        }}></MenuItem>

                        <MenuItem title="Старый 33333" startGroup onClick={async () => {
                            alert("fuf")
                        }}></MenuItem>
                        <MenuItem title="Старый +++" onClick={async () => {
                            alert("fuf")
                        }}></MenuItem>
                    </MenuItem>
                    <MenuItem title="Изменить"></MenuItem>
                    <MenuSeparator/>
                    <MenuItem title="Админ">
                        <MenuItem
                            title="Инспектор объектов"
                            onClick={async () => {
                                this.openWindow(<SchemaExplorerWindow
                                    window={{height: 500, width: 400}}>

                                </SchemaExplorerWindow>);
                            }}>
                        </MenuItem>
                        <MenuSeparator/>
                        <MenuItem
                            title="Список тестов"
                            onClick={async () => {
                                this.openWindow(
                                    <TestsExplorerWindow
                                        window={{height: 600, width: 800}}>
                                    </TestsExplorerWindow>
                                );
                            }}></MenuItem>
                    </MenuItem>
                </Menu>
                <Toolbar groups={this.toolbarGroups} items={this.toolbarItems}></Toolbar>
                {this.renderWindows()}
            </div>
        )
    }

    async openWindow(win: React.ReactElement<any>): Promise<any> {

        return new Promise<boolean>((resolve: (result: any) => void, reject: (error: string) => void) => {


            if (win.props.window) {
                if (!win.props.window.id)
                    win.props.window.id = "rand_" + getRandomString();
                else {
                    win.props.window.id = "win_" + getSHA1hex(win.props.window.id);
                    let jqxWin: any = $("#" + win.props.window.id);
                    if (jqxWin.length > 0) {
                        jqxWin.jqxWindow("bringToFront");
                        return;
                    }
                }
                win.props.window.onClose = resolve;
                this.windows.push(React.cloneElement(win, {key: getRandomString()}));
            }
            else {
                this.windows.push(React.cloneElement(win, {onClose: resolve, key: getRandomString()}))
            }
            this.forceUpdate();
        });
    }

    closeWindow(win: Window) {
        let winFromList = this.windows.find((w: any) => w.id === win.props.id);
        if (win) {
            this.windows.slice(this.windows.indexOf(winFromList), 1);
            this.forceUpdate();
            win.destroy();
            console.log("win.destroy");
        }
    }

    async openSchemaWindow(winId: string, props: any = {}): Promise<void> {
        await this.loadBabelScript(winId);
        let winClass = (window as any)[winId];
        if (!props.key)
            props.key = getRandomString();
        this.openWindow(new winClass().render(props));
    }

    async loadBabelScript(className: string): Promise<void> {
        if ((window as any)[className])
            return;

        let fileName = replaceAll(className, "_", "/") + ".jsx";

        let script: any;

        try {
            script = await $.get(fileName);
        }
        catch (e) {
            throwError( "не найден файл '" + fileName + "'");
        }

        let compiledScript = Babel.transform(script, {presets: ['es2017', 'react']}).code;

        let shortClassName = className.split("_").pop();

        compiledScript += `;window.${className}=${shortClassName};`;

        //console.log(className, compiledScript);

        eval(compiledScript);

        if (!(window as any)[className])
            throwError( "ошибка загрузки '" + fileName + "'");

    }
}
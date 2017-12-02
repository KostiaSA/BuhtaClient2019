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

    renderWindows(): React.ReactNode {
        return this.windows.slice();
    }

    render() {
        console.log("render desktop");
        return (
            <div id="desktop" style={{height: "100%", flex: "1 0 auto"}}>
                <Menu mode="horizontal"/>
                <button
                    onClick={async () => {
                        let result = await loadSchemaTree();
                        console.log(result);
                    }}>
                    loadSchemaTree
                </button>
                <button
                    onClick={() => {
                        this.openWindow(<SchemaExplorerWindow
                            window={{height: 500, width: 400}}></SchemaExplorerWindow>);
                    }}>
                    инспектор объектов
                </button>
                <button
                    onClick={() => {
                        this.openWindow(<SchemaTableDesignerWindow window={{height: 444, width: 600}}
                                                                   objectId="buhta/test1/Автомобиль"></SchemaTableDesignerWindow>);
                        //  this.openWindow(<div key="111" title="111">новое окно</div>);
                    }}>
                    open SchemaTableDesignerWindow
                </button>
                <button
                    onClick={() => {
                        saveSchemaObjectFiles({filePath: "buhta/test1/Организация1233", json: "{ага4}"})
                            .then((res) => {
                                console.log("ok", res)
                            })
                            .catch((err) => {
                                console.log("err:", err)
                            })
                    }}>
                    test seveSchemaObjectFiles
                </button>
                {this.renderWindows()}
            </div>
        )
    }

    async openWindow(win: React.ReactElement<any>): Promise<boolean> {

        return new Promise<boolean>((resolve: (result: boolean) => void, reject: (error: string) => void) => {


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
                this.windows.push(win);
            }
            else {
                this.windows.push(React.cloneElement(win, {onClose: resolve}))
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
            throw "не найден файл '" + fileName + "'";
        }

        let compiledScript = Babel.transform(script, {presets: ['es2017', 'react']}).code;

        let shortClassName = className.split("_").pop();

        compiledScript += `;window.${className}=${shortClassName};`;

        //console.log(className, compiledScript);

        eval(compiledScript);

        if (!(window as any)[className])
            throw "ошибка загрузки '" + fileName + "'";

    }
}
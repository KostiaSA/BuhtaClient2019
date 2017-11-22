import * as  React from "react";
import {appState} from "../AppState";
import {Window} from "./Window";
import {getRandomString} from "../utils/getRandomString";
import {replaceAll} from "../utils/replaceAll";
import {SchemaTableDesignerWindow} from "../admin/SchemaTableDesignerWindow";
import {IComponentProps} from "./Component";
import {loadSchemaObjectFiles} from "../admin/api/loadSchemaObjectFiles";


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
                <button
                    onClick={() => {
                        this.openWindow(<Window key={getRandomString()} title="111">новое окно</Window>);
                        //  this.openWindow(<div key="111" title="111">новое окно</div>);
                    }}>
                    open win
                </button>
                <button
                    onClick={() => {
                        this.openSchemaWindow("buhta_test1_TestWindow", {title: getRandomString()});
                        //  this.openWindow(<div key="111" title="111">новое окно</div>);
                    }}>
                    open buhta/test1/TestWindow
                </button>
                <button
                    onClick={() => {
                        this.openWindow(<SchemaTableDesignerWindow window={{height: 444, width: 600}}
                                                                   tableId="buhta/test1/Автомобиль"></SchemaTableDesignerWindow>);
                        //  this.openWindow(<div key="111" title="111">новое окно</div>);
                    }}>
                    open SchemaTableDesignerWindow
                </button>
                <button
                    onClick={() => {
                        loadSchemaObjectFiles("buhta/test1/Автомобиль")
                            .then((res) => {
                                console.log("ok", res)
                            })
                            .catch((err) => {
                                console.log("err:", err)
                            })
                    }}>
                    test loadSchemaObjectFiles
                </button>
                <Window key="222" ref={(e) => {
                    this.w = e!
                }} left={10} top={50} height={300} width={600} title={this.t}>
                    <button onClick={() => {
                        this.t = "жопа";
                        this.b = "ага";
                        this.forceUpdate();
                        this.w.updateProps({top: 300, left: 300, title: "уроды"});
                    }
                    }>ok2:{this.b}</button>
                </Window>
                {this.renderWindows()}
            </div>
        )
    }

    async openWindow(win: React.ReactElement<any>): Promise<boolean> {
        // if (win.type !== Window && !((win.type as any).prototype instanceof Window))
        //     throw "Desktop.openWindow(): win должно быть типа Window";

        // if (!win.key)
        //     throw "Desktop.openWindow(): у win не заполнен аттрибут 'key'";


        return new Promise<boolean>((resolve: (result: boolean) => void, reject: (error: string) => void) => {
//            this.windows.push(React.cloneElement(win, {window:{onClose: resolve}} as IWindowProps));
            win.props.window.id = getRandomString();
            win.props.window.onClose = resolve;
            this.windows.push(win);
            this.forceUpdate();
        });
    }

    closeWindow(win: Window) {
        let winFromList = this.windows.find((w: any) => w.props.window.id === win.props.id);
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
import * as  React from "react";
import {appState} from "../AppState";
import {IWindowProps, Window} from "./Window";
import {getRandomString} from "../utils/getRandomString";
import {replaceAll} from "../utils/replaceAll";


export interface IDesktopProps {
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
                        this.openSchemaWindow("buhta_test1_TestWindow");
                        //  this.openWindow(<div key="111" title="111">новое окно</div>);
                    }}>
                    open buhta/test1/TestWindow
                </button>
                <Window key="222" ref={(e) => {
                    this.w = e!
                }} left={10} top={50} height={300} width={600} title={this.t}>
                    <button onClick={() => {
                        this.t = "жопа2";
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

    openWindow(win: React.ReactElement<IWindowProps>) {
        if (win.type !== Window)
            throw "Desktop.openWindow(): win должно быть типа Window";

        if (!win.key)
            throw "Desktop.openWindow(): у win не заполнен аттрибут 'key'";

        this.windows.push(win);
        this.forceUpdate();
    }

    async openSchemaWindow(winId: string): Promise<void> {
        await this.loadBabelScript(winId);
        let winClass = (window as any)[winId];
        this.openWindow(new winClass().render());
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
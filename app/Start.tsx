import * as  React from "react";
import * as  ReactDOM from "react-dom";
import {Desktop} from "./ui/Desktop";
import {appState} from "./AppState";
import {SchemaWindow} from "./schema/window/SchemaWindow";
import {Window} from "./ui/Window";
import {FormPanel} from "./ui/FormPanel";
import {FormPanelItem} from "./ui/FormPanelItem";
import {TabsPanel} from "./ui/TabsPanel";
import {TabsPanelItem} from "./ui/TabsPanelItem";
import {Input} from "./ui/inputs/Input";

async function start() {

    await appState.start();
    let w = (window as any);
    w.appState = appState;
    w.React = React;

    w.Window = Window;
    w.SchemaWindow = SchemaWindow;

    w.FormPanel = FormPanel;
    w.FormPanelItem = FormPanelItem;

    w.TabsPanel = TabsPanel;
    w.TabsPanelItem = TabsPanelItem;

    w.Input = Input;

    // window.addEventListener('unhandledrejection', (event: any) => {
    //     console.error(event.reason.statusText || event.reason);
    // });



    // await require("./clientStartup").clientStartup();
    // await require("../platform-admin/clientStartup").clientStartup();

    // let objects = (await findSchemaObjectsApiRequest({where: {type: "SchemaApp"}})).objects;
    // if (objects.length === 0)
    //     throw "в конфигурации нет ни одного объекта 'SchemaApp'";
    //
    // let schemaApp = objects[0] as ISchemaAppProps;

    // let startPage = new SchemaPage();
    // await startPage.load((document as any).schemaPageId);
    //let startPage=await SchemaHelper.createSchemaObject<SchemaPage>((document as any).schemaPageId);
    //let startPageTemplate = appState.getRegisteredClassInfo<IPageTemplateClassInfo>(startPage.props.template);

//    ReactDOM.render(React.createElement(startPageTemplate.constructor,{schemaPageId:startPage.props.id} as any /*IPageTemplateProps*/), document.getElementById("content"));
    //ReactDOM.render(<PageTemplate>ПРИВЕТ 90 !!!</PageTemplate>, document.getElementById("content"));

}

start()
    .then(() => {
        ReactDOM.render(<Desktop/>, document.getElementById("content"));
        // findSchemaObjectsApiRequest({where: {}}).then((result: ISchemaObjectProps[]) => {
        // });
        //
        //
        // ReactDOM.render(<div>ПРИВЕТ !!!
        //     77<TestButton/><SaveSchemObjectTestButton/><LoadSchemObjectTestButton/><PageTemplate/>
        // </div>, document.getElementById("content"));
    })
    .catch((err: any) => {
        console.error(err);
        ReactDOM.render(<div>ОШИБКА СТАРТА: {err.toString()}</div>, document.getElementById("content"));
    });



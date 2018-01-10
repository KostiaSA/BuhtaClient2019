import * as  React from "react";
import * as  ReactDOM from "react-dom";
import {Desktop} from "./ui/Desktop";
import {appState} from "./AppState";
import {config} from "./config";
import {registerHost} from "./registerHost";
import {webSocketInit} from "./utils/webSocket";

async function start() {

    await appState.start();

    registerHost();

    ($ as any).jqx.theme = config.theme;


    // disable the default browser's context menu.
    $(document).on('contextmenu', (e) => {
        return false;
    });

    webSocketInit();

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



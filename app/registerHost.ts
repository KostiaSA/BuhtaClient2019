import {config} from "./const/config";
import {appState} from "./AppState";
import {BaseTest} from "./test/BaseTest";
import {FormPanel} from "./ui/FormPanel";
import {FormPanelItem} from "./ui/FormPanelItem";
import {Input} from "./ui/inputs/Input";
import {TabsPanel} from "./ui/TabsPanel";
import {TabsPanelItem} from "./ui/TabsPanelItem";
import {SchemaWindow} from "./schema/window/SchemaWindow";
import {Window} from "./ui/Window";
import {executeSql} from "./admin/api/executeSql";
import {SchemaTable} from "./schema/table/SchemaTable";
import {SchemaObject} from "./schema/SchemaObject";

declare const chai: any;
declare const window: any;

export function registerHost() {

    window.CONST = require("numeric-constants");

    window.assert = chai.assert;

    window.buhta = {
        appState: appState,
        admin: {
            executeSql: executeSql
        },
        test: {
            BaseTest: BaseTest
        },
        const: {
            config: config,
        },
        schema: {
            SchemaObject: SchemaObject,
            SchemaTable: SchemaTable,
        },
        ui: {
            Input: Input,
            FormPanel: FormPanel,
            FormPanelItem: FormPanelItem,
            TabsPanel: TabsPanel,
            TabsPanelItem: TabsPanelItem,
            Window: Window,
            SchemaWindow: SchemaWindow,

        }
    };


}
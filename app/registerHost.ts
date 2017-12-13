import {config} from "./config";
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
import {base64ToArrayBuffer} from "./utils/base64ToArrayBuffer";
import {arrayBufferToBase64} from "./utils/arrayBufferToBase64";
import {XJSON_parse, XJSON_parse_postprocess, XJSON_stringify} from "./utils/xjson";

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
        config: config,
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

        },
        util: {
            base64ToArrayBuffer:base64ToArrayBuffer,
            arrayBufferToBase64:arrayBufferToBase64,
            XJSON_stringify:XJSON_stringify,
            XJSON_parse:XJSON_parse,
            XJSON_parse_postprocess:XJSON_parse_postprocess,
        }
    };


}
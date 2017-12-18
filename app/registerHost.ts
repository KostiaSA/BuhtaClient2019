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
import {
    checkGuid,
    emptyGuid,
    guidFromBase64,
    guidFromHex,
    guidToBase64,
    guidToHex,
    isGuid,
    isGuidOrNull,
    isGuidsEqual,
    maxGuid,
    minGuid,
    newGuid
} from "./utils/guid";
import {hexStringToUint8Array} from "./utils/hexStringToUint8Array";
import {arrayToHexString} from "./utils/arrayToHexString";
import {downloadStringAsFile} from "./utils/downloadStringAsFile";

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
            hexStringToUint8Array: hexStringToUint8Array,
            arrayToHexString: arrayToHexString,
            base64ToArrayBuffer: base64ToArrayBuffer,
            arrayBufferToBase64: arrayBufferToBase64,
            XJSON_stringify: XJSON_stringify,
            XJSON_parse: XJSON_parse,
            XJSON_parse_postprocess: XJSON_parse_postprocess,
            newGuid: newGuid,
            emptyGuid: emptyGuid,
            minGuid: minGuid,
            maxGuid: maxGuid,
            isGuid: isGuid,
            isGuidOrNull: isGuidOrNull,
            checkGuid: checkGuid,
            guidFromBase64: guidFromBase64,
            guidToBase64: guidToBase64,
            isGuidsEqual: isGuidsEqual,
            guidFromHex: guidFromHex,
            guidToHex: guidToHex,
            downloadStringAsFile:downloadStringAsFile,
        }
    };


}
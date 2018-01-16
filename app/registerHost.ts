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
import {adminExecuteSql} from "./admin/api/adminExecuteSql";
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
import {addNewLineSymbol} from "./utils/addNewLineSymbol";
import {isStringOrNullOrEmpty} from "./utils/isStringOrNullOrEmpty";
import {isString} from "./utils/isString";
import {isStringOrNull} from "./utils/isStringOrNull";
import {notifySuccess} from "./utils/notifySuccess";
import {getDatabaseDialect} from "./sql/getDatabaseDialect";
import {executeSql} from "./api/executeSql";
import {throwError} from "./utils/throwError";
import {assert} from "./test/assert";
import {registerUserColor, userColors} from "./utils/registerUserColor";
import {getColorValue} from "./utils/getColorValue";
import {emptyStringToUndefined} from "./utils/emptyStringToUndefined";
import {getSchemaObjectProps} from "./schema/getSchemaObjectProps";
import {getRandomString} from "./utils/getRandomString";

declare const chai: any;
declare const window: any;

export function registerHost() {

    // window.onerror = function(msg:any, url:any, line:any, col:any, error:any) {
    //     console.error("<-------- здесь смотри call stack по ошибке, которая ниже");
    //
    //     // // Note that col & error are new to the HTML 5 spec and may not be
    //     // // supported in every browser.  It worked for me in Chrome.
    //     // var extra = !col ? '' : '\ncolumn: ' + col;
    //     // extra += !error ? '' : '\nerror: ' + error;
    //     //
    //     // // You can view the information in an alert to see things working like this:
    //     // alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
    //     //
    //     // // TODO: Report this error via ajax so you can keep track
    //     // //       of what pages have JS issues
    //     //
    //     // var suppressErrorAlert = true;
    //     // // If you return true, then error alerts (like in older versions of
    //     // // Internet Explorer) will be suppressed.
    //     // return suppressErrorAlert;
    // };

    window.CONST = require("numeric-constants");

    window.assert = assert;
    window.throwError = throwError;

    window.buhta = {
        appState: appState,
        admin: {
            adminExecuteSql: adminExecuteSql
        },
        test: {
            BaseTest: BaseTest
        },
        config: config,
        schema: {
            SchemaObject: SchemaObject,
            SchemaTable: SchemaTable,
            getSchemaObjectProps:getSchemaObjectProps
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
        sql: {
            getDatabaseDialect: getDatabaseDialect,
            executeSql: executeSql,
        },
        util: {
            hexStringToUint8Array: hexStringToUint8Array,
            arrayToHexString: arrayToHexString,
            base64ToArrayBuffer: base64ToArrayBuffer,
            arrayBufferToBase64: arrayBufferToBase64,

            XJSON_stringify: XJSON_stringify,
            XJSON_parse: XJSON_parse,
            XJSON_parse_postprocess: XJSON_parse_postprocess,

            getRandomString:getRandomString,

            newGuid: newGuid,
            emptyGuid: emptyGuid,
            minGuid: minGuid,
            maxGuid: maxGuid,
            isGuid: isGuid,
            isGuidOrNull: isGuidOrNull,
            isGuidsEqual: isGuidsEqual,
            checkGuid: checkGuid,
            guidFromBase64: guidFromBase64,
            guidToBase64: guidToBase64,
            guidFromHex: guidFromHex,
            guidToHex: guidToHex,

            downloadStringAsFile: downloadStringAsFile,
            addNewLineSymbol: addNewLineSymbol,

            isString: isString,
            isStringOrNull: isStringOrNull,
            isStringOrNullOrEmpty: isStringOrNullOrEmpty,

            notifySuccess: notifySuccess,

            registerUserColor: registerUserColor,
            getColorValue: getColorValue,
            userColors: userColors,

            emptyStringToUndefined:emptyStringToUndefined,

        }
    };


}
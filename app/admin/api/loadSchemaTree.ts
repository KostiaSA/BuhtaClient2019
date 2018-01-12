import axios from "axios";
import {throwError} from "../../utils/throwError";
import {appState} from "../../AppState";
import {XJSON_stringify} from "../../utils/xjson";

export interface ISchemaTree {
    name: string;
    items?: ISchemaTree[];
}

export async function loadSchemaTree(path: string = "", objectTypes: string[] = []): Promise<ISchemaTree> {

    let req = {
        sessionId:appState.sessionId,
        windowId:appState.windowId,
        authTooken:appState.authToken,
        path: path,
        objectTypes: objectTypes
    };

    let response: any = await axios.post("api/admin/loadSchemaTree", {xjson:XJSON_stringify(req)});

    if (response.data.error)
        throwError( response.data.error);
    else
        return response.data;

    throw "fake";

}
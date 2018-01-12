import axios from "axios";
import {throwError} from "../utils/throwError";
import {appState} from "../AppState";
import {XJSON_stringify} from "../utils/xjson";


export interface ISchemaObjectFiles {
    json?: string;
    jsx?: string;
}

export async function loadSchemaObjectFiles(filePath: string): Promise<ISchemaObjectFiles> {

    if (filePath.endsWith(".json")) {
        throwError("loadSchemaObjectFiles(): filePath не должен содержать '.json')");
        //filePath = filePath.slice(0, -5);
    }

    let req = {
        sessionId:appState.sessionId,
        windowId:appState.windowId,
        authToken:appState.authToken,
        filePath: filePath
    };

    let response: any = await axios.post('api/loadSchemaObjectFiles', {xjson:XJSON_stringify(req)});

    if (response.data.error)
        throwError(response.data.error);
    else
        return response.data;

    throw "fake";

}
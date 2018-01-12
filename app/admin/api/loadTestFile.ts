import axios from "axios";
import {throwError} from "../../utils/throwError";
import {XJSON_stringify} from "../../utils/xjson";
import {appState} from "../../AppState";


export async function loadTestFile(filePath: string): Promise<string> {

    // if (filePath.endsWith(".json"))
    //     filePath = filePath.slice(0, -5);

    let req = {
        sessionId:appState.sessionId,
        windowId:appState.windowId,
        authToken:appState.authToken,
        filePath: filePath
    };

    let response: any = await axios.post("api/admin/loadTestFile", {xjson:XJSON_stringify(req)});

    if (response.data.error)
        throwError( response.data.error);
    else
        return response.data.code;

    throw "fake";
}
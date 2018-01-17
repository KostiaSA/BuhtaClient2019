import axios from "axios";
import {SqlDialect} from "../sql/SqlEmitter";
import {throwError} from "../utils/throwError";
import {appState} from "../AppState";
import {XJSON_stringify} from "../utils/xjson";


export async function doStart(): Promise<boolean> {

    let req = {
        sessionId:appState.sessionId,
        windowId:appState.windowId,
        authToken:appState.authToken,
    };

    let response: any = await axios.post("api/doStart", {xjson:XJSON_stringify(req)});

    if (response.data.error)
        throwError(response.data.error);
    else
        return true;

    throw "fake";

}
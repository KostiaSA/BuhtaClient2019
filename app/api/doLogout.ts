import axios from "axios";
import {throwError} from "../utils/throwError";
import {appState} from "../AppState";
import {XJSON_stringify} from "../utils/xjson";


export async function doLogout(): Promise<void> {

    let req = {
        sessionId: appState.sessionId,
        windowId: appState.windowId,
        authToken: appState.authToken,
        login: appState.login,
    };

    appState.clearAuthToken();

    let response: any = await axios.post("api/doLogout", {xjson: XJSON_stringify(req)});

    if (response.data.error)
        throwError(response.data.error);


}
import axios from "axios";
import {throwError} from "../utils/throwError";
import {appState} from "../AppState";
import {XJSON_stringify} from "../utils/xjson";
import {guidFromHex} from "../utils/guid";


export async function doLogin(login: string, password: string): Promise<void> {

    let req = {
        sessionId: appState.sessionId,
        windowId: appState.windowId,
        authToken: appState.authToken,
        login: login,
        password: password
    };

    appState.clearAuthToken();

    let response: any = await axios.post("api/doLogin", {xjson: XJSON_stringify(req)});

    if (response.data.error)
        throwError(response.data.error);
    else {
        appState.setAuthToken(response.data.authToken, login, guidFromHex(response.data.userId));
    }

}
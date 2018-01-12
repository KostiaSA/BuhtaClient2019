import axios from "axios";
import {throwError} from "../../utils/throwError";
import {appState} from "../../AppState";
import {XJSON_stringify} from "../../utils/xjson";

export interface ITests {
    name: string;
    items?: ITests[];
}

export async function loadTests(path: string = "", objectTypes: string[] = []): Promise<ITests> {

    let req = {
        sessionId:appState.sessionId,
        windowId:appState.windowId,
        authToken:appState.authToken,
        path: path
    };

    let response: any = await axios.post("api/admin/loadTests", {xjson:XJSON_stringify(req)});

    if (response.data.error)
        throwError( response.data.error);
    else
        return response.data;

    throw "fake";

}
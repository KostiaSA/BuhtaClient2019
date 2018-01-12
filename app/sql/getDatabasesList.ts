import axios from "axios";
import {SqlDialect} from "./SqlEmitter";
import {throwError} from "../utils/throwError";
import {appState} from "../AppState";
import {XJSON_stringify} from "../utils/xjson";

export interface IDatabase {
    name: string;
    dialect: SqlDialect;
    note: string;
    sqlName: string;
}

export async function getDatabasesList(): Promise<IDatabase[]> {

    let req = {
        sessionId:appState.sessionId,
        windowId:appState.windowId,
        authToken:appState.authToken,
    };

    let response: any = await axios.post("api/getDatabasesList", {xjson:XJSON_stringify(req)});

    if (response.data.error)
        throwError(response.data.error);
    else
        return response.data.dbList;

    throw "fake";

}
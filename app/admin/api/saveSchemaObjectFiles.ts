import axios from "axios";
import {throwError} from "../../utils/throwError";
import {appState} from "../../AppState";
import {XJSON_stringify} from "../../utils/xjson";


export interface ISavedSchemaObjectFiles {
    filePath: string;
    json?: string;
    jsx?: string;
    sql?: string;
}

declare var js_beautify: any;

export async function saveSchemaObjectFiles(req: ISavedSchemaObjectFiles): Promise<void> {
    if (req.filePath.endsWith(".json"))
        req.filePath = req.filePath.slice(0, -5);

    if (req.json)
        req.json = js_beautify(req.json);

    if (req.jsx)
        req.jsx = js_beautify(req.jsx);

    (req as any).sessionId = appState.sessionId;
    (req as any).windowId = appState.windowId;
    (req as any).authToken = appState.authToken;


    let response: any = await axios.post("api/admin/saveSchemaObjectFiles", {xjson:XJSON_stringify(req)});

    if (response.data.error)
        throwError(response.data.error);


}
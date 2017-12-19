import axios from "axios";


export interface ISavedSchemaObjectFiles {
    filePath: string;
    json?: string;
    jsx?: string;
    sql?:string;
}

declare var js_beautify: any;

export async function saveSchemaObjectFiles(req: ISavedSchemaObjectFiles): Promise<void> {
    if (req.filePath.endsWith(".json"))
        req.filePath = req.filePath.slice(0, -5);

    if (req.json)
        req.json = js_beautify(req.json);

    if (req.jsx)
        req.jsx = js_beautify(req.jsx);

    let response: any = await axios.post('api/admin/saveSchemaObjectFiles', req);

    if (response.data.error)
        throw response.data.error;

}
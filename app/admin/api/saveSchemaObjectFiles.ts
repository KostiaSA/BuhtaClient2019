import axios from "axios";


export interface ISavedSchemaObjectFiles {
    filePath: string;
    json?: string;
    jsx?: string;
}

export async function saveSchemaObjectFiles(req: ISavedSchemaObjectFiles): Promise<void> {

    let response: any = await axios.post('api/admin/saveSchemaObjectFiles', req);

    if (response.data.error)
        throw response.data.error;

}
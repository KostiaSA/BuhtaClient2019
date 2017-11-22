import axios from "axios";


export interface ISchemaObjectFiles {
    json?: string;
    jsx?: string;
}

export async function loadSchemaObjectFiles(filePath: string): Promise<ISchemaObjectFiles> {

    let req = {
        filePath: filePath
    };

    let response: any = await axios.post('api/admin/loadSchemaObjectFiles', req);

    if (response.data.error)
        throw response.data.error;
    else
        return response.data;

}
import axios from "axios";

export interface ISchemaTree {
    name: string;
    items?: ISchemaTree[];
}

export async function loadSchemaTree(path: string = "", objectTypes: string[] = []): Promise<ISchemaTree> {

    let req = {
        path: path,
        objectTypes: objectTypes
    };

    let response: any = await axios.post('api/admin/loadSchemaTree', req);

    if (response.data.error)
        throw response.data.error;
    else
        return response.data;

}
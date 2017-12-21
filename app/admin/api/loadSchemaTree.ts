import axios from "axios";
import {throwError} from "../../utils/throwError";

export interface ISchemaTree {
    name: string;
    items?: ISchemaTree[];
}

export async function loadSchemaTree(path: string = "", objectTypes: string[] = []): Promise<ISchemaTree> {

    let req = {
        path: path,
        objectTypes: objectTypes
    };

    let response: any = await axios.post("api/admin/loadSchemaTree", req);

    if (response.data.error)
        throwError( response.data.error);
    else
        return response.data;

    throw "fake";

}
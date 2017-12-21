import axios from "axios";
import {throwError} from "../../utils/throwError";

export interface ITests {
    name: string;
    items?: ITests[];
}

export async function loadTests(path: string = "", objectTypes: string[] = []): Promise<ITests> {

    let req = {
        path: path
    };

    let response: any = await axios.post("api/admin/loadTests", req);

    if (response.data.error)
        throwError( response.data.error);
    else
        return response.data;

    throw "fake";

}
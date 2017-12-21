import axios from "axios";
import {throwError} from "../../utils/throwError";


export async function loadTestFile(filePath: string): Promise<string> {

    // if (filePath.endsWith(".json"))
    //     filePath = filePath.slice(0, -5);

    let req = {
        filePath: filePath
    };

    let response: any = await axios.post("api/admin/loadTestFile", req);

    if (response.data.error)
        throwError( response.data.error);
    else
        return response.data.code;

    throw "fake";
}
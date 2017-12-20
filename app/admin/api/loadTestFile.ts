import axios from "axios";


export async function loadTestFile(filePath: string): Promise<string> {

    // if (filePath.endsWith(".json"))
    //     filePath = filePath.slice(0, -5);

    let req = {
        filePath: filePath
    };

    let response: any = await axios.post("api/admin/loadTestFile", req);

    if (response.data.error)
        throw response.data.error;
    else
        return response.data.code;

}
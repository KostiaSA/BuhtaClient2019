import axios from "axios";

export interface IDatabase {
    name: string;
    dialect: string;
    note: string;
}

export async function getDatabasesList(): Promise<IDatabase[]> {

    let response: any = await axios.post("api/admin/getDatabasesList", {});

    if (response.data.error)
        throw response.data.error;
    else
        return response.data.dbList;

}
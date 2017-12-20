import axios from "axios";
import {SqlDialect} from "./SqlEmitter";

export interface IDatabase {
    name: string;
    dialect: SqlDialect;
    note: string;
}

export async function getDatabasesList(): Promise<IDatabase[]> {

    let response: any = await axios.post("api/getDatabasesList", {});

    if (response.data.error)
        throw response.data.error;
    else
        return response.data.dbList;

}
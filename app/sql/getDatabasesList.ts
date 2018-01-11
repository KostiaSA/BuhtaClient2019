import axios from "axios";
import {SqlDialect} from "./SqlEmitter";
import {throwError} from "../utils/throwError";

export interface IDatabase {
    name: string;
    dialect: SqlDialect;
    note: string;
    sqlName: string;
}

export async function getDatabasesList(): Promise<IDatabase[]> {

    let response: any = await axios.post("api/getDatabasesList", {});

    if (response.data.error)
        throwError(response.data.error);
    else
        return response.data.dbList;

    throw "fake";

}
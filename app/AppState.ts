import {Desktop} from "./ui/Desktop";
import {BaseSqlDataType} from "./schema/table/datatypes/BaseSqlDataType";
import {registerSqlDataTypes} from "./schema/table/datatypes/registerSqlDataTypes";

export class AppState {

    public desktop: Desktop;

    public sqlDataTypes: { [name: string]: BaseSqlDataType } = {};

    public get sqlDataTypesAsArray(): BaseSqlDataType[] {
        return Object.keys(this.sqlDataTypes).map((key:string)=>this.sqlDataTypes[key]);
    }

    async start() {
        registerSqlDataTypes();
    }
}

export const appState = new AppState();
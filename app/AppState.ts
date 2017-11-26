import {Desktop} from "./ui/Desktop";
import {BaseSqlDataType} from "./schema/table/datatypes/BaseSqlDataType";
import {registerSqlDataTypes} from "./schema/table/datatypes/registerSqlDataTypes";

export class AppState {

    public desktop: Desktop;

    public sqlDataTypes: { [name: string]: BaseSqlDataType } = {};

    async start() {
        registerSqlDataTypes();
    }
}

export const appState = new AppState();
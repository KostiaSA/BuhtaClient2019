import {Desktop} from "./ui/Desktop";
import {BaseSqlDataType} from "./schema/table/datatypes/BaseSqlDataType";
import {registerSqlDataTypes} from "./schema/table/datatypes/registerSqlDataTypes";
import {SchemaObject} from "./schema/SchemaObject";
import {registerSchemaObjectTypes} from "./schema/registerSchemaObjectTypes";

export class AppState {

    public desktop: Desktop;

    public sqlDataTypes: { [name: string]: BaseSqlDataType } = {};

    public get sqlDataTypesAsArray(): BaseSqlDataType[] {
        return Object.keys(this.sqlDataTypes).map((key: string) => this.sqlDataTypes[key]);
    }

    public schemaObjectTypes: { [name: string]: typeof SchemaObject } = {};

    public get schemaObjectTypesAsArray(): typeof SchemaObject[] {
        return Object.keys(this.schemaObjectTypes).map((key: string) => this.schemaObjectTypes[key]);
    }

    async start() {
        registerSqlDataTypes();
        registerSchemaObjectTypes();
    }
}

export const appState = new AppState();
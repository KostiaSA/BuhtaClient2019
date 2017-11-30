import {appState} from "../AppState";
import {SchemaTable} from "./table/SchemaTable";

export function registerSchemaObjectTypes() {
    appState.schemaObjectTypes[SchemaTable.objectType] = SchemaTable;

}

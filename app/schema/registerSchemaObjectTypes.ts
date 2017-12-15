import {appState} from "../AppState";
import {SchemaTable} from "./table/SchemaTable";
import {SchemaQuery} from "./query/SchemaQuery";

export function registerSchemaObjectTypes() {
    appState.schemaObjectTypes[SchemaTable.objectType] = SchemaTable;
    appState.schemaObjectTypes[SchemaQuery.objectType] = SchemaQuery;

}

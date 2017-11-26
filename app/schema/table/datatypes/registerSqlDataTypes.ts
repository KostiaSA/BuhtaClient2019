import {appState} from "../../../AppState";
import {StringSqlDataType} from "./StringSqlDataType";
import {IntegerSqlDataType} from "./IntegerSqlDataType";

export function registerSqlDataTypes(){
    appState.sqlDataTypes[IntegerSqlDataType.id] = new IntegerSqlDataType();
    appState.sqlDataTypes[StringSqlDataType.id] = new StringSqlDataType();

}

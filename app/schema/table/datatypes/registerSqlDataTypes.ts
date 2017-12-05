import {appState} from "../../../AppState";
import {StringSqlDataType} from "./StringSqlDataType";
import {IntegerSqlDataType} from "./IntegerSqlDataType";
import {FkSqlDataType} from "./FkSqlDataType";

export function registerSqlDataTypes(){
    appState.sqlDataTypes[IntegerSqlDataType.id] = new IntegerSqlDataType();
    appState.sqlDataTypes[StringSqlDataType.id] = new StringSqlDataType();
    appState.sqlDataTypes[FkSqlDataType.id] = new FkSqlDataType();

}

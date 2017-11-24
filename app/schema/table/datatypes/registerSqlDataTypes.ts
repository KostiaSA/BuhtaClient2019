import {appState} from "../../../AppState";
import {StringSqlDataType} from "./StringSqlDataType";
import {IntegerSqlDataType} from "./IntegerSqlDataType";

export function registerSqlDataTypes(){
    appState.sqlDataTypes["целое"] = IntegerSqlDataType;
    appState.sqlDataTypes["строка"] = StringSqlDataType;

}

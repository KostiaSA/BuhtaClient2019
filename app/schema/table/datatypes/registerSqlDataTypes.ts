import {appState} from "../../../AppState";
import {StringSqlDataType} from "./StringSqlDataType";
import {IntegerSqlDataType} from "./IntegerSqlDataType";
import {FkSqlDataType} from "./FkSqlDataType";
import {GuidSqlDataType} from "./GuidSqlDataType";
import {MoneySqlDataType} from "./MoneySqlDataType";
import {DecimalSqlDataType} from "./DecimalSqlDataType";

export function registerSqlDataTypes(){
    appState.sqlDataTypes[IntegerSqlDataType.id] = new IntegerSqlDataType();
    appState.sqlDataTypes[StringSqlDataType.id] = new StringSqlDataType();
    appState.sqlDataTypes[FkSqlDataType.id] = new FkSqlDataType();
    appState.sqlDataTypes[GuidSqlDataType.id] = new GuidSqlDataType();
    appState.sqlDataTypes[MoneySqlDataType.id] = new MoneySqlDataType();
    appState.sqlDataTypes[DecimalSqlDataType.id] = new DecimalSqlDataType();

}

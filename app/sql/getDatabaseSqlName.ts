import {config} from "../config";
import {getDatabasesList, IDatabase} from "../api/getDatabasesList";
import {isString} from "../utils/isString";
import {throwError} from "../utils/throwError";

let databasesCache: IDatabase[];

export async function getDatabaseSqlName(dbName: string = config.mainDatabaseName): Promise<string> {
    if (!databasesCache) {
        databasesCache = await getDatabasesList();
    }

    if (!isString(dbName))
        throwError( "getDatabaseSqlName(dbName): 'dbName' должна быть строкой");

    let db = databasesCache.find((db) => db.name === dbName);
    if (db)
        return db.sqlName;
    else {
        throwError("getDatabaseSqlName(dbName): не найдена база данных с именем '" + dbName + "'");
        throw "fake";
    }
}
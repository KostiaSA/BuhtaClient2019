import {SqlDialect} from "./SqlEmitter";
import {config} from "../config";
import {getDatabasesList, IDatabase} from "../api/getDatabasesList";
import {isString} from "../utils/isString";

let databasesCache: IDatabase[];

export async function getDatabaseDialect(dbName: string = config.mainDatabaseName): Promise<SqlDialect> {
    if (!databasesCache) {
        databasesCache = await getDatabasesList();
    }

    if (!isString(dbName))
        throw "getDatabaseDialect(dbName): 'dbName' должна быть строкой";

    let db = databasesCache.find((db) => db.name === dbName);
    if (db)
        return db.dialect;
    else
        throw "getDatabaseDialect(dbName): не найдена база данных с именем '" + dbName + "'";
}
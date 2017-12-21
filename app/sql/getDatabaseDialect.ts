import {SqlDialect} from "./SqlEmitter";
import {config} from "../config";
import {getDatabasesList, IDatabase} from "./getDatabasesList";
import {isString} from "../utils/isString";
import {throwError} from "../utils/throwError";

let databasesCache: IDatabase[];

export async function getDatabaseDialect(dbName: string = config.mainDatabaseName): Promise<SqlDialect> {
    if (!databasesCache) {
        databasesCache = await getDatabasesList();
    }

    if (!isString(dbName))
        throwError( "getDatabaseDialect(dbName): 'dbName' должна быть строкой");

    let db = databasesCache.find((db) => db.name === dbName);
    if (db)
        return db.dialect;
    else {
        throwError("getDatabaseDialect(dbName): не найдена база данных с именем '" + dbName + "'");
        throw "fake";
    }
}
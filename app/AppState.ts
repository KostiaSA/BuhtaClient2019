import {Desktop} from "./ui/Desktop";
import {BaseSqlDataType} from "./schema/table/datatypes/BaseSqlDataType";
import {registerSqlDataTypes} from "./schema/table/datatypes/registerSqlDataTypes";
import {SchemaObject} from "./schema/SchemaObject";
import {registerSchemaObjectTypes} from "./schema/registerSchemaObjectTypes";
import {Guid, guidToHex, newGuid} from "./utils/guid";
import {XJSON_parse, XJSON_stringify} from "./utils/xjson";
import {getRandomString} from "./utils/getRandomString";


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

    get userId(): string {
        return "Иванов17-20";
    }

    get sessionIdAsStr(): string {
        return guidToHex(this.sessionId);
    }

    windowId: string;

    private cachedSessionId: Guid;

    get sessionId(): Guid {
        if (!this.cachedSessionId) {
            let sessionIdStr = localStorage.getItem("buhta-sessionId");
            if (sessionIdStr) {
                this.cachedSessionId = XJSON_parse(sessionIdStr);
            }
            else {
                this.cachedSessionId = newGuid();
                localStorage.setItem("buhta-sessionId", XJSON_stringify(this.cachedSessionId));
            }
        }
        return this.cachedSessionId;
    }

    get authToken(): string {
        return "Иванов17-20";
    }

    async start() {
        registerSqlDataTypes();
        registerSchemaObjectTypes();
        this.windowId=getRandomString(10);
    }
}

export const appState = new AppState();
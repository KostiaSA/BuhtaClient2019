import {ISchemaObjectProps} from "./SchemaObject";
import {loadSchemaObjectFiles} from "../api/loadSchemaObjectFiles";
import {isString} from "../utils/isString";
import {XJSON_parse} from "../utils/xjson";

export let schemaObjectJsonCache: { [objectId: string]: string; } = {};

export async function getSchemaObjectProps<P extends ISchemaObjectProps=ISchemaObjectProps>(objectId: string): Promise<P> {

    if (!isString(objectId))
        throw "getSchemaObjectProps(): 'objectId' должен быть строкой";

    let json = schemaObjectJsonCache[objectId];
    if (!json) {
        let res = await loadSchemaObjectFiles(objectId);
        schemaObjectJsonCache[objectId] = res.json!;
        json = res.json!;
    }

    return XJSON_parse(json);
}
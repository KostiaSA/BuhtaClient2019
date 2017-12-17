import {ISchemaObjectProps} from "./SchemaObject";
import {loadSchemaObjectFiles} from "../api/loadSchemaObjectFiles";
import {isString} from "../utils/isString";
import {XJSON_parse} from "../utils/xjson";

export let schemaObjectJsonCache: { [objectId: string]: ISchemaObjectProps; } = {};

export async function getSchemaObjectProps<P extends ISchemaObjectProps=ISchemaObjectProps>(objectId: string): Promise<P> {

    if (!isString(objectId))
        throw "getSchemaObjectProps(): 'objectId' должен быть строкой";

    let props = schemaObjectJsonCache[objectId] as P;
    if (!props) {
        let res = await loadSchemaObjectFiles(objectId);
        props = XJSON_parse(res.json!);
        props.objectId=objectId;
        schemaObjectJsonCache[objectId] = props;
    }

    return props;
}
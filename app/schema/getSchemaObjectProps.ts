import {ISchemaObjectProps} from "./SchemaObject";
import {loadSchemaObjectFiles} from "../api/loadSchemaObjectFiles";
import {isString} from "../utils/isString";
import {XJSON_parse} from "../utils/xjson";
import {throwError} from "../utils/throwError";

export let schemaObjectJsonCache: { [objectId: string]: ISchemaObjectProps; } = {};

export async function getSchemaObjectProps<P extends ISchemaObjectProps=ISchemaObjectProps>(objectId: string): Promise<P> {

    if (!isString(objectId))
        throwError( "getSchemaObjectProps(): 'objectId' должен быть строкой");

    if (objectId.endsWith(".json")) {
        throwError("getSchemaObjectProps(): objectId не должен содержать '.json')");
    }


    let props = schemaObjectJsonCache[objectId] as P;
    if (!props) {
        let res = await loadSchemaObjectFiles(objectId);
        props = XJSON_parse(res.json!);
        props.objectId = props.objectId || objectId;
        schemaObjectJsonCache[objectId] = props;
    }

    return props;
}
import {ISchemaObjectClassInfo, SchemaObject} from "../SchemaObject";
import {ISchemaObjectProps} from "../ISchemaObject";
import * as  React from "react";

export interface ISchemaWindowProps extends ISchemaObjectProps {
}


export interface ISchemaWindowClassInfo extends ISchemaObjectClassInfo<typeof SchemaWindow> {

}

export class SchemaWindow extends SchemaObject<ISchemaWindowProps> { //implements ISchemaTableRow {

    static classInfo: ISchemaWindowClassInfo = {
        title: "Таблица",
        description: "Sql - таблица",
        className: "platform-core:SchemaWindow",
        constructor: SchemaWindow,
        recordIdPrefix: "schema-table",
    };

    render():React.ReactNode {
        return <div>empty schema window</div>;
    }


}
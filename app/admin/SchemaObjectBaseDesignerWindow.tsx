import * as  React from "react";

import {IWindowProps} from "../ui/Window";


export interface ISchemaObjectDesignerProps {
    objectId?: string;
    window?: IWindowProps;
    newObjectPath?: string;
}

export class SchemaObjectBaseDesignerWindow extends React.Component<ISchemaObjectDesignerProps, any> {


}
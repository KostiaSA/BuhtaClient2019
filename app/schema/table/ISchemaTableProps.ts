import {ISchemaObjectProps} from "../ISchemaObject";
import {ISchemaTableColumnProps} from "./ISchemaTableColumnProps";
//import {ISchemaTableEditOptions} from "./ISchemaTableEditOptions";

export interface ISchemaTableProps extends ISchemaObjectProps {
    sqlName?: string;
    columns: ISchemaTableColumnProps[];
  //  editOptions?: ISchemaTableEditOptions;
}


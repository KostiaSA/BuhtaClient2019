import {ISchemaObjectProps} from "../ISchemaObject";
import {SchemaObject} from "../SchemaObject";
import {IBaseSqlDataTypeProps} from "./datatypes/BaseSqlDataType";
//import {IFormInputOptions} from "../form/IFormInputOptions";

export interface ISchemaTableColumnProps {
    name: string;
    primaryKey?: boolean;
    description?: string;
    position?: number;
    notNull?:boolean,
    dataType: IBaseSqlDataTypeProps;

    //formInputOptions?: IFormInputOptions;
}


import {ISqlDataTypeProps} from "./ISqlDataTypeProps";

export interface IIntegerSqlDataTypeProps extends ISqlDataTypeProps {
    size?: "8" | "16" | "32" | "64";
    unsigned?: boolean;
    autoIncrement?:boolean;
}


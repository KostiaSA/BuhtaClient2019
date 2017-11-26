import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";


export interface IIntegerSqlDataTypeProps extends IBaseSqlDataTypeProps {
    size?: "8" | "16" | "32" | "64";
    unsigned?: boolean;
    autoIncrement?: boolean;
}

export class IntegerSqlDataType extends BaseSqlDataType<IIntegerSqlDataTypeProps> {

    public static id = "Integer";

    getPropsNames(): string[] {
        return [...super.getPropsNames(),"size", "unsigned", "autoIncrement"];
    }

    getName(): string {
        return "Целое";
    }


    dataTypeUserFriendly(props: IIntegerSqlDataTypeProps, parentReactComp: React.ReactElement<any>): React.ReactNode {
        return (
            <span
                style={{color: "teal"}}>{(props.unsigned ? "+" : "") + this.getName() + props.size + (props.autoIncrement ? ", autoInc" : "")}
            </span>
        );

    }

}
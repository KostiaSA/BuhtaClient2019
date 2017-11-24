import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";


export interface IIntegerSqlDataTypeProps extends IBaseSqlDataTypeProps {
    size?: "8" | "16" | "32" | "64";
    unsigned?: boolean;
    autoIncrement?: boolean;
}

export class IntegerSqlDataType extends BaseSqlDataType<IIntegerSqlDataTypeProps> {

    dataTypeUserFriendly(parentReactComp: React.ReactElement<any>): React.ReactNode {
        return (
            <span
                style={{color: "teal"}}>{(this.props.unsigned ? "+" : "") + "целое" + this.props.size + (this.props.autoIncrement ? ", autoInc" : "")}
            </span>
        );

    }

}
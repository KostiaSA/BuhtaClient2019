import * as React from "react";
import {ISqlDataTypeClassInfo, SqlDataType} from "./SqlDataType";
import {IIntegerSqlDataTypeProps} from "./IIntegerSqlDataTypeProps";

export class IntegerSqlDataType extends SqlDataType<IIntegerSqlDataTypeProps> {

    static classInfo: ISqlDataTypeClassInfo = {
        className: "platform-core:IntegerSqlDataType",
        constructor: IntegerSqlDataType,
        title: "целое"
    };


    dataTypeUserFriendly(parentReactComp: React.Component<any, any>): string | JSX.Element {
        return (
            <span
                style={{color: "teal"}}>{(this.props.unsigned ? "+" : "") + "целое" + this.props.size + (this.props.autoIncrement ? ", autoInc" : "")}
            </span>
        );

    }

}
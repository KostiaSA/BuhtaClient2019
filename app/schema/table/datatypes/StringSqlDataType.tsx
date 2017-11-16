import * as React from "react";

import {ISqlDataTypeClassInfo, SqlDataType} from "./SqlDataType";
import {IStringSqlDataTypeProps} from "./IStringSqlDataTypeProps";
import {ISchemaTableColumnProps} from "../ISchemaTableColumnProps";
export class StringSqlDataType extends SqlDataType<IStringSqlDataTypeProps> {


    static classInfo: ISqlDataTypeClassInfo = {
        className: "platform-core:StringSqlDataType",
        constructor: StringSqlDataType,
        title: "строка",
        // renderEditor: (columnProps: ISchemaTableColumnProps, attrs?: any): JSX.Element | JSX.Element[] => {
        //     return [
        //         <FormInput
        //             {...attrs}
        //             mode="input"
        //             label="длина"
        //             bindProperty="dataType.maxLen"
        //             defaultValue="50"
        //             style={{maxWidth: 100}}
        //             tooltip="ноль или пустое значение означает максимальную длину.."
        //             rules={[{required: true, message: "тип данных должнен быть заполнен"}]}
        //         />
        //     ]
        // }

    };


    dataTypeUserFriendly(parentReactComp: React.Component<any, any>): string | JSX.Element {
        let maxLenStr = "(MAX)";

        if (this.props.maxLen && this.props.maxLen > 0)
            maxLenStr = "(" + this.props.maxLen + ")";

        return (
            <span
                style={{color: "indianred"}}>{StringSqlDataType.classInfo.title + maxLenStr}
                </span>
        );
    }


}
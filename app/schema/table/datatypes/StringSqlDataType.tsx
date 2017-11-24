import * as React from "react";

import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";

export interface IStringSqlDataTypeProps extends IBaseSqlDataTypeProps {
    maxLen?: number;
}

export class StringSqlDataType extends BaseSqlDataType<IStringSqlDataTypeProps> {


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


    dataTypeUserFriendly(parentReactComp: React.ReactElement<any>): React.ReactNode {
        let maxLenStr = "(MAX)";

        if (this.props.maxLen && this.props.maxLen > 0)
            maxLenStr = "(" + this.props.maxLen + ")";

        return (
            <span
                style={{color: "indianred"}}>{this.props.dataTypeName + maxLenStr}
            </span>
        );
    }


}
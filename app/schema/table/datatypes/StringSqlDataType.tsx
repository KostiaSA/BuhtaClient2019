import * as React from "react";

import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";

export interface IStringSqlDataTypeProps extends IBaseSqlDataTypeProps {
    maxLen?: number;
}

export class StringSqlDataType extends BaseSqlDataType<IStringSqlDataTypeProps> {

    public static id = "String";

    getName(): string {
        return "Строка";
    }

    getPropsNames(): string[] {
        return [...super.getPropsNames(),"maxLen"];
    }

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


    dataTypeUserFriendly(props: IStringSqlDataTypeProps,parentReactComp: React.ReactElement<any>): React.ReactNode {
        let maxLenStr = "(MAX)";

        if (props.maxLen && props.maxLen > 0)
            maxLenStr = "(" + props.maxLen + ")";

        return (
            <span
                style={{color: "indianred"}}>{this.getName() + maxLenStr}
            </span>
        );
    }


}
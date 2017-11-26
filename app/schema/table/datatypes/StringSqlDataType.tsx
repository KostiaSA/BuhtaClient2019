import * as React from "react";

import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {Input} from "../../../ui/inputs/Input";

export interface IStringSqlDataTypeProps extends IBaseSqlDataTypeProps {
    maxLen?: number;
}

export class StringSqlDataType extends BaseSqlDataType<IStringSqlDataTypeProps> {

    public static id = "String";

    getName(props?: IStringSqlDataTypeProps): string {
        if (!props)
            return "Строка";
        else {
            let maxLenStr = "(MAX)";

            if (props.maxLen && props.maxLen > 0)
                maxLenStr = "(" + props.maxLen + ")";

            return this.getName() + maxLenStr;

        }
    }

    getPropsNames(): string[] {
        return [...super.getPropsNames(), "maxLen"];
    }

    setDefaultProps(props: IStringSqlDataTypeProps) {
        props.maxLen = props.maxLen || 50;
    }

    renderPropsEditors(props: IStringSqlDataTypeProps): React.ReactNode {
        this.setDefaultProps(props);
        return (
            <Input
                title="макс. длина"
                bindProp="dataType.maxLen"
                placeHolder="макс. длина"
                width={100}
                hidden={props.id !== StringSqlDataType.id}
            />
        )
    }

    dataTypeUserFriendly(props: IStringSqlDataTypeProps, parentReactComp: React.ReactElement<any>): React.ReactNode {
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
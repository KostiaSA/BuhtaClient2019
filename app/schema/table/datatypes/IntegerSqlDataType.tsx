import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {Input} from "../../../ui/inputs/Input";


export interface IIntegerSqlDataTypeProps extends IBaseSqlDataTypeProps {
    size?: "8" | "16" | "32" | "64";
    unsigned?: boolean;
    autoIncrement?: boolean;
}

export class IntegerSqlDataType extends BaseSqlDataType<IIntegerSqlDataTypeProps> {

    public static id = "Integer";

    getPropsNames(): string[] {
        return [...super.getPropsNames(), "size", "unsigned", "autoIncrement"];
    }

    setDefaultProps(props: IIntegerSqlDataTypeProps) {
        props.size = "32";
    }

    getName(): string {
        return "Целое";
    }

    renderPropsEditors(props: IIntegerSqlDataTypeProps): React.ReactNode {
        return <Input title="макс. длина" bindProp="maxLen" placeHolder="макс. длина" width={100}/>
    }

    dataTypeUserFriendly(props: IIntegerSqlDataTypeProps, parentReactComp: React.ReactElement<any>): React.ReactNode {
        return (
            <span
                style={{color: "teal"}}>{(props.unsigned ? "+" : "") + this.getName() + props.size + (props.autoIncrement ? ", autoInc" : "")}
            </span>
        );

    }

}
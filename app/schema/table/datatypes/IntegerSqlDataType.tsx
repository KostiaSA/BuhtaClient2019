import * as React from "react";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {ComboBox} from "../../../ui/inputs/ComboBox";


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
        props.size = props.size || "32";
    }

    getName(): string {
        return "Целое";
    }

    renderPropsEditors(props: IIntegerSqlDataTypeProps): React.ReactNode {
        //return ()<Input title="макс. длина" bindProp="dataType.maxLen" placeHolder="макс. длина" width={100}/>
        this.setDefaultProps(props);
        return (
            <ComboBox
                title="размерность"
                width={80}
                bindProp="dataType.size"
                placeHolder="размерность"
                displayMember="d"
                valueMember="v"
                source={[{v: "8", d: "8bit"}, {v: "16", d: "16bit"}, {v: "32", d: "32bit"}, {v: "64", d: "64bit"}]}
                hidden={props.id !== IntegerSqlDataType.id}
            />

        )
    }

    dataTypeUserFriendly(props: IIntegerSqlDataTypeProps, parentReactComp: React.ReactElement<any>): React.ReactNode {
        return (
            <span
                style={{color: "teal"}}>{(props.unsigned ? "+" : "") + this.getName() + props.size + (props.autoIncrement ? ", autoInc" : "")}
            </span>
        );

    }

}
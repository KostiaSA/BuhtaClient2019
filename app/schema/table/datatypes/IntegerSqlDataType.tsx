import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {ComboBox} from "../../../ui/inputs/ComboBox";
import {SqlDialect} from "../../../sql/SqlEmitter";


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

    getName(props?: IIntegerSqlDataTypeProps): string {
        if (!props)
            return "Целое";
        else {
            return (props.unsigned ? "+" : "") + this.getName() + props.size + (props.autoIncrement ? ", autoInc" : "")
        }
    }

    getValidator(): Joi.ObjectSchema {
        return super.getValidator().keys({
            size: Joi.string().only(["8", "16", "32", "64"]).label("размерность"),
            unsigned: Joi.boolean().label("беззнаковое"),
            autoIncrement: Joi.boolean().label("автонумерация"),

        })
    };

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

    // todo autoincrement
    emitColumnDataType(dialect: SqlDialect, col: IIntegerSqlDataTypeProps): string {
        if (dialect === "mssql") {
            if (col.unsigned) {
                switch (col.size) {
                    case "8":
                        return ("SMALLINT");
                    case "16":
                        return ("INT");
                    case "32":
                        return ("BIGINT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
            else {
                switch (col.size) {
                    case "8":
                        return ("TINYINT");
                    case "16":
                        return ("SMALLINT");
                    case "32":
                        return ("INT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
        }
        else if (dialect === "postgres") {
            if (col.unsigned) {
                switch (col.size) {
                    case "8":
                        return ("SMALLINT");
                    case "16":
                        return ("INT");
                    case "32":
                        return ("BIGINT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
            else {
                switch (col.size) {
                    case "8":
                        return ("SMALLINT");
                    case "16":
                        return ("SMALLINT");
                    case "32":
                        return ("INT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
        }
        else if (dialect === "mysql") {
            if (col.unsigned) {
                switch (col.size) {
                    case "8":
                        return ("TINYINT UNSIGNED");
                    case "16":
                        return ("SMALLINT UNSIGNED");
                    case "32":
                        return ("INT UNSIGNED");
                    case "64":
                        return ("BIGINT UNSIGNED");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
            else {
                switch (col.size) {
                    case "8":
                        return ("TINYINT");
                    case "16":
                        return ("SMALLINT");
                    case "32":
                        return ("INT");
                    case "64":
                        return ("BIGINT");
                    default:
                        throw "invalid col.size " + col.size;
                }
            }
        }
        else {
            let msg = "IntegerSqlDataType.emitColumnDataType(): invalid sql dialect '" + dialect + "'";
            console.error(msg);
            throw msg + ", " + __filename;
        }

    }

}
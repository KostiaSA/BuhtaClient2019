import * as React from "react";
import * as Joi from "joi";
import {joiRus} from "../../../i18n/joiRus";
import {appState} from "../../../AppState";
import {SqlDialect} from "../../../sql/SqlEmitter";

//export type SqlDialect = "mysql" | "postgres" | "mssql";

export interface IBaseSqlDataTypeProps {
    id: string;
}


// export interface ISqlDataTypeClassInfo extends IClassInfo<typeof BaseSqlDataType> {
//     title: string;
//     renderEditor?: (columnProps: ISchemaTableColumnProps, attrs?: any) => JSX.Element | JSX.Element[];
// }


export class BaseSqlDataType<P extends IBaseSqlDataTypeProps=IBaseSqlDataTypeProps> {
    //props: P;

    // static renderEditor(columnProps: ISchemaTableColumnProps, attrs?: any): JSX.Element | JSX.Element[] {
    //     return null as any;
    // }

    getPropsNames(): string[] {
        return ["id"];
    }

    setDefaultProps(props: any) {
    }

    getName(props?: IBaseSqlDataTypeProps): string {
        return "?";
    }

    getValidator(): Joi.ObjectSchema {
        return Joi.object().options({language: joiRus}).keys({
            id: Joi.string().only(Object.keys(appState.sqlDataTypes)).label("тип данных"),
        })
    };

    copyProps(props: any): P {
        let ret: any = {};
        for (let propName of this.getPropsNames()) {
            ret[propName] = props[propName];
        }
        return ret;
    }

    renderPropsEditors(props: P): React.ReactNode {
        return null;
    }

    emitColumnDataType(dialect: SqlDialect, col: IBaseSqlDataTypeProps): string {
        throw  "BaseSqlDataType.emitColumnDataType(): abstract error";
    }
}


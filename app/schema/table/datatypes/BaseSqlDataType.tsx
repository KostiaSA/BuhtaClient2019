import * as React from "react";

export type SqlDialect = "mysql" | "postgres" | "mssql";

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

    getName(): string {
        return "?";
    }

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

    dataTypeUserFriendly(props: P, parentReactComp: React.ReactElement<any>): React.ReactNode {
        return <span>{this.getName()}</span>;
    }

}


import * as React from "react";

export type SqlDialect = "mysql" | "postgres" | "mssql";

export interface IBaseSqlDataTypeProps {
    dataTypeName: string;
}


// export interface ISqlDataTypeClassInfo extends IClassInfo<typeof BaseSqlDataType> {
//     title: string;
//     renderEditor?: (columnProps: ISchemaTableColumnProps, attrs?: any) => JSX.Element | JSX.Element[];
// }


export class BaseSqlDataType<P extends IBaseSqlDataTypeProps> {
    props: P;

    // static renderEditor(columnProps: ISchemaTableColumnProps, attrs?: any): JSX.Element | JSX.Element[] {
    //     return null as any;
    // }

    dataTypeUserFriendly(parentReactComp: React.ReactElement<any>): React.ReactNode {
        return <span>{this.props.dataTypeName}</span>;
    }

}


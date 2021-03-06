import * as  React from "react";


export interface IDbGridColumnProps {
    headerText?: string;
    datafield?: string;
    displayfield?: string;
    cellsformat?: string;
    aggregates?: string[];
    color?: string ;
    background?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    fontFamily?: string;
    getColor?: (row: any) => string;
    getBackground?: (row: any) => string;
    getFontSize?: (row: any) => string;
    getFontWeight?: (row: any) => string;
    getFontStyle?: (row: any) => string;
    getFontFamily?: (row: any) => string;
    getText?: (row: any) => React.ReactNode;
    align?: "left" | "center" | "right";
    width?: number;
    maxWidth?: number;
    minWidth?: number;
    resizable?: boolean;
    draggable?: boolean;
    pinned?: boolean;
}

export class DbGridColumn extends React.Component<IDbGridColumnProps> {
    // static childContextTypes = {
    //     bindObj: PropTypes.object
    // };
    //
    // static contextTypes = {
    //     bindObj: PropTypes.object
    // };
    //
    // getChildContext() {
    //     return {bindObj: this.props.bindObj || this.context.bindObj};
    // }

    render() {
        return null;
    }

}
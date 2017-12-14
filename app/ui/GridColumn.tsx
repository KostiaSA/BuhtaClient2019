import * as  React from "react";


export interface IGridColumnProps {
    text?: string;
    datafield?: string;
    displayfield?: string;
    cellsformat?: string;
    aggregates?: string[];
//    cellsrenderer?: (row: any,columnfield: any, value: any, defaulthtml: any) => string;
    compute?: (row: any) => React.ReactNode;
    align?: "left" | "center" | "right";
    width?: number;
    maxWidth?: number;
    minWidth?: number;
    resizable?: boolean;
    draggable?: boolean;
    pinned?: boolean;
}

export class GridColumn extends React.Component<IGridColumnProps> {
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
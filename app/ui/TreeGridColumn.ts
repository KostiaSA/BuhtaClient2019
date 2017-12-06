import * as  React from "react";

export interface ITreeGridColumnProps {
    text?: string;
    datafield?: string;
    displayfield?: string;
    cellsformat?: string;
    aggregates?: string[];
//    cellsrenderer?: (row: any,columnfield: any, value: any, defaulthtml: any) => string;
    compute?: (row: any) => string;
}

export class TreeGridColumn extends React.Component<ITreeGridColumnProps> {
    render() {
        return null;
    }
}


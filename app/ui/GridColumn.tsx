import * as  React from "react";


export interface IGridColumnProps {
    text?: string;
    datafield?: string;
    displayfield?: string;
    cellsformat?: string;
    aggregates?:string[];
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
import * as  React from "react";
import * as PropTypes from "prop-types";
import {Component} from "./Component";
import {omit} from "../utils/omit";
import {GridColumn} from "./GridColumn";


export interface IGridProps {
    height?: string | number;
    width?: string | number;
    source?: any;
    rowsheight?: number;
    columnsheight?: number;
}

export class Grid extends Component<IGridProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static contextTypes = {
        bindObj: PropTypes.object
    };

    // get isChanged(): boolean {
    //     if (!this.initialValue)
    //         return false;
    //     else
    //         return stringify(this.initialValue) !== stringify(objectPathGet(this.props.bindObj || this.context.bindObj, this.props.bindProp));
    // }

    initialValue: any;

    componentDidMount() {
        console.log("didmount Grid " + this.$id);
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);
        //this.initialValue = objectPathGet(this.props.bindObj || this.context.bindObj, this.props.bindProp);
        //this.widget.jqxGrid("val", this.initialValue);
    }

    updateProps(props: IGridProps, create: boolean) {
        let gridOptions: any = omit(props, ["children", "source"]);
        gridOptions.height = gridOptions.height || "100%";
        gridOptions.width = gridOptions.width || "100%";
        gridOptions.rowsheight = gridOptions.rowsheight || 22;
        gridOptions.columnsheight = gridOptions.columnsheight || 22;

        gridOptions.source = {
            localdata: props.source,
            datatype: "array",
        };

        gridOptions.columns = [];
        for (let col of React.Children.toArray(this.props.children)) {
            if ((col as any).type === GridColumn) {
                let columnOptions = omit((col as any).props, ["children"]);
                if (!columnOptions.text)
                    columnOptions.text = columnOptions.datafield || "?datafield";
                gridOptions.columns.push(columnOptions);
            }
        }

        this.widget.jqxGrid(gridOptions);
    }


    render() {
        console.log("render Grid");

        return (
            <div id={this.$id}/>
        )
    }

}
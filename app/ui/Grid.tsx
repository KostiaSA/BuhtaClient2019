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
    sortable?: boolean;
}

export class Grid extends Component<IGridProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static contextTypes = {
        bindObj: PropTypes.object
    };

    lastParentH: number;
    resizeIntervalId: any;

    componentDidMount() {
        console.log("didmount Grid " + this.$id);
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);

        if (!this.props.height || this.props.height === "100%") {
            this.resizeIntervalId = setInterval(() => {
                let newH = this.widget.parent().innerHeight();

                // отановка таймера resize, если grid удалена
                if ($("#" + this.$id).length !== 1) {
                    clearInterval(this.resizeIntervalId);
                }

                if (newH > 10 && this.lastParentH !== newH) {
                    //console.log("resize",this.$id,this.lastParentH,newH);
                    this.lastParentH = newH;
                    this.widget.jqxGrid({height: newH});
                }
            }, 300);
        }
    }

    updateProps(props: IGridProps, create: boolean) {
        let gridOptions: any = omit(props, ["children", "source"]);
        gridOptions.height = gridOptions.height || 350;
        gridOptions.width = gridOptions.width || "100%";
        gridOptions.rowsheight = gridOptions.rowsheight || 22;
        gridOptions.columnsheight = gridOptions.columnsheight || 22;

        if (gridOptions.sortable !== false)
            gridOptions.sortable = true;

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
        this.widget = $("#" + this.$id);

    }

    clearSelection() {
        this.widget.jqxGrid("clearselection");
    }

    getSelectedRowIndex(): number {
        return this.widget.jqxGrid("getselectedrowindex");
    }

    getSelectedRowIndexes(): number[] {
        return this.widget.jqxGrid("getselectedrowindexes");
    }

    selectAllRows() {
        this.widget.jqxGrid("selectallrows");
    }

    selectRow(rowIndex: number) {
        this.widget.jqxGrid("selectrow", rowIndex);
    }

    unselectRow(rowIndex: number) {
        this.widget.jqxGrid("unselectrow", rowIndex);
    }

    // getRowData(rowIndex: number) {
    //     this.props.source
    //     this.widget.jqxGrid("getrowdata", rowIndex);
    // }

    render() {
        console.log("render Grid");

        return (
            <div id={this.$id}/>
        )
    }

}
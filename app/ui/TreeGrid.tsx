import * as  React from "react";
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";
import {Keycode} from "../utils/Keycode";
import {ITreeGridColumnProps, TreeGridColumn} from "./TreeGridColumn";

export interface ITreeGridSourcHierarchy {
    root?: string; // 'children'
    keyDataField?: { name: string },          // id
    parentDataField?: { name: string }  // parentId
}

export interface ITreeGridSource {
    localData: any;
    dataType: "json" | "array";
    id: string,
    hierarchy?: ITreeGridSourcHierarchy;
    dataFields?: any[];
}

export interface ITreeGridProps extends IComponentProps {
    height?: string | number;
    width?: string | number;
    source: ITreeGridSource;
    sortable?: boolean;
    onRowDoubleClick?: (rowIndex: number) => void;
    onRowKeyDown?: (rowIndex: number, keyCode: Keycode) => boolean;
    popup?: React.ReactNode | ((rowItem: any) => Promise<React.ReactNode>);
    icons?: boolean;
    checkboxes?: boolean;
    hierarchicalCheckboxes?: boolean;
    enableHover?: boolean;
}

export class TreeGrid extends Component<ITreeGridProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static contextTypes = {
        ...Component.contextTypes,
        bindObj: PropTypes.object
    };

    lastParentH: number;
    resizeIntervalId: any;

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);

        if (!this.props.height || this.props.height === "100%") {
            this.resizeIntervalId = setInterval(() => {
                let newH = this.widget.parent().height();

                // отановка таймера resize, если TreeGrid удалена
                if ($("#" + this.$id).length !== 1) {
                    clearInterval(this.resizeIntervalId);
                }

                if (newH > 10 && this.lastParentH !== newH) {
                    //console.log("resize",this.$id,this.lastParentH,newH);
                    this.lastParentH = newH;
                    this.widget.jqxTreeGrid({height: newH});
                }
            }, 300);
        }
    }

    updateProps(props: ITreeGridProps, create: boolean) {
        let treeGridOptions: any = omit(props, ["children", "source", "onRowDoubleClick", "onRowKeyDown", "popup"]);
        treeGridOptions.height = treeGridOptions.height || 350;
        treeGridOptions.width = treeGridOptions.width || "100%";

        if (treeGridOptions.sortable !== false)
            treeGridOptions.sortable = true;

        // treeGridOptions.source = {
        //     localdata: props.source,
        //     datatype: "array",
        // };

        treeGridOptions.source = new (($ as any).jqx.dataAdapter)(props.source);


        treeGridOptions.columns = [];
        for (let col of React.Children.toArray(this.props.children)) {
            if ((col as any).type === TreeGridColumn) {
                let colProps = (col as any).props as ITreeGridColumnProps;
                let columnOptions = omit(colProps, ["children", "compute"]);
                if (!columnOptions.text)
                    columnOptions.text = columnOptions.datafield || "?datafield";
                // if (colProps.compute) {
                //     columnOptions.cellsrenderer = (rowIndex: number, columnfield: any, value: any, defaulthtml: string): string => {
                //         let defaultHtmlStart = defaulthtml.replace("</div>", "");
                //         let defaultHtmlEnd = "</div>";
                //         let row = props.source[rowIndex];
                //         let computedValue: string;
                //         try {
                //             computedValue = escapeHtml(colProps.compute!(row));
                //         }
                //         catch (e) {
                //             computedValue = "<span style='color: indianred'>" + escapeHtml("Ошибка в compute(): " + e.toString().substr(0, 40)) + "</span>";
                //             console.error("Ошибка в compute(): " + e.toString());
                //         }
                //         return defaultHtmlStart + computedValue + defaultHtmlEnd;
                //     };
                // }
                treeGridOptions.columns.push(columnOptions);
            }
        }

        // todo getSelectedRowIndex не работает
        if (this.props.onRowKeyDown) {
            // treeGridOptions.handlekeyboardnavigation = (event: any) => {
            //     //console.log("handlekeyboardnavigation", event.keyCode, this.widget[0].offsetParent);
            //     if (this.getWindow().disabled)
            //         return false;
            //     else
            //         return this.props.onRowKeyDown!(this.getSelectedRowIndex(), event.keyCode);
            // };
        }

        console.log("treeGridOptions==============================", treeGridOptions);
        try {
            this.widget.jqxTreeGrid(treeGridOptions);
        }
        catch (error) {
            console.error(error);
        }
        this.widget = $("#" + this.$id);

        if (this.props.onRowDoubleClick)
            this.widget.on("rowdoubleclick", (event: any) => {
                this.props.onRowDoubleClick!(event.args.rowindex);
            });
        else
            this.widget.off("rowdoubleclick");

    }

    getCheckedRows():any[]{
        return this.widget.jqxTreeGrid("getCheckedRows");
    }

    clearSelection() {
        this.widget.jqxTreeGrid("clearSelection");
    }



    selectRow(rowId: string) {
        this.widget.jqxTreeGrid("selectRow", rowId);
    }

    unselectRow(rowId: string) {
        this.widget.jqxTreeGrid("unselectRow", rowId);
    }

    focus() {
        this.widget.jqxTreeGrid("focus");
    }

    // getRowData(rowIndex: number) {
    //     this.props.source
    //     this.widget.jqxTreeGrid("getrowdata", rowIndex);
    // }

    render() {
        console.log("render TreeGrid");

        return (
            <div id={this.$id}/>
        )
    }

}
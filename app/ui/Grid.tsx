import * as  React from "react";
import * as ReactDOMServer from 'react-dom/server';
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";
import {GridColumn, IGridColumnProps} from "./GridColumn";
import {Keycode} from "../utils/Keycode";
import {config} from "../config";
import {isString} from "../utils/isString";
import {isFunction} from "../utils/isFunction";


export interface IGridProps extends IComponentProps {
    height?: string | number;
    width?: string | number;
    source?: any;
    rowsheight?: number;
    columnsheight?: number;
    sortable?: boolean;
    onRowDoubleClick?: (rowIndex: number) => void;
    onRowKeyDown?: (rowIndex: number, keyCode: Keycode) => boolean;
    columnsResize?: boolean;
    columnsReorder?: boolean;

}

export class Grid extends Component<IGridProps> {

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
        let gridOptions: any = omit(props, ["children", "source", "onRowDoubleClick", "onRowKeyDown", "popup"]);
        gridOptions.height = gridOptions.height || 350;
        gridOptions.width = gridOptions.width || "100%";
        gridOptions.rowsheight = gridOptions.rowsheight || config.grid.rowsHeight;
        gridOptions.columnsheight = gridOptions.columnsheight || config.grid.rowsHeight;

        if (gridOptions.sortable !== false)
            gridOptions.sortable = true;

        if (gridOptions.columnsResize !== false)
            gridOptions.columnsResize = true;

        gridOptions.source = {
            localdata: props.source,
            datatype: "array",
        };

        gridOptions.columns = [];
        for (let col of React.Children.toArray(this.props.children)) {
            if ((col as any).type === GridColumn) {
                let colProps = (col as any).props as IGridColumnProps;

                let columnOptions = omit(colProps, [
                    "children",
                    "headerText",
                    "color",
                    "background",
                    "fontWeight",
                    "fontStyle",
                    "fontFamily",
                    "getColor",
                    "getBackground",
                    "getFontSize",
                    "getFontWeight",
                    "getFontStyle",
                    "getFontFamily",
                    "getText"
                ]);


                columnOptions.align = columnOptions.align || "left";

                columnOptions.cellsalign = columnOptions.align;

                columnOptions.text = colProps.headerText;
                if (!columnOptions.text)
                    columnOptions.text = columnOptions.datafield || "?datafield";

                columnOptions.cellClassName = (rowId: string, datafieldName: any, datafieldValue: any, row: string): string => {

                    let className = "";

                    if (colProps.background) {
                        if (isString(colProps.background))
                            className += " background-" + colProps.background + "-important";
                        else
                            console.error("TreeGrid(): background должен быть строкой", colProps.background);
                    }
                    else if (colProps.getBackground && isFunction(colProps.getBackground!)) {

                        try {
                            let value = colProps.getBackground(row);
                            if (isString(value))
                                className += " background-" + value + "-important";
                            else
                                console.error("TreeGrid(): getBackground должен возвращать строку", value);
                        }
                        catch (e) {
                            console.error("TreeGrid(): exception в cellClassName", e);
                        }
                    }

                    return className;
                };


                columnOptions.cellsrenderer = (rowIndex: number, columnfield: any, value: any, defaulthtml: string): string => {

                    if (!colProps.getText &&
                        !colProps.color && !colProps.getColor &&
                        !colProps.background && !colProps.getBackground &&
                        !colProps.fontStyle && !colProps.getFontStyle &&
                        !colProps.fontWeight && !colProps.getFontWeight &&
                        !colProps.fontFamily && !colProps.getFontFamily &&
                        !colProps.fontSize && !colProps.getFontSize
                    )
                        return defaulthtml;

                    let el = document.createElement("div");
                    el.innerHTML = defaulthtml;
                    let defaultSpan = el.childNodes[0] as HTMLElement;

                    let createError = (message: string) => {
                        defaultSpan.innerText = "ошибка: " + message;
                        defaultSpan.title = "ошибка: " + message;
                        defaultSpan.style.color = "red";
                        console.error(defaultSpan.innerText);
                        return defaultSpan.outerHTML;
                    };

                    let row = props.source[rowIndex];

                    // --------------------------- color --------------------------
                    if (colProps.color) {
                        if (!isString(colProps.color))
                            return createError("'color' должен быть строкой");
                        defaultSpan.style.color = colProps.color;
                    }
                    if (colProps.getColor) {
                        if (!isFunction(colProps.getColor!))
                            return createError("'getColor' должен быть функцией");

                        try {
                            let value = colProps.getColor(row);
                            if (!isString(value))
                                return createError("'getColor' должен возвращать строку");
                            defaultSpan.style.color = value;
                        }
                        catch (e) {
                            return createError(" в 'getColor': " + e.toString());
                        }
                    }

                    // // --------------------------- background --------------------------
                    // if (colProps.background) {
                    //     if (!isString(colProps.background))
                    //         return createError("'background' должен быть строкой");
                    //     defaultSpan.style.background = colProps.background;
                    // }
                    // if (colProps.getBackground) {
                    //     if (!isFunction(colProps.getBackground!))
                    //         return createError("'getBackground' должен быть функцией");
                    //
                    //     try {
                    //         let value = colProps.getBackground(row);
                    //         if (!isString(value))
                    //             return createError("'getBackground' должен возвращать строку");
                    //         defaultSpan.style.background = value;
                    //     }
                    //     catch (e) {
                    //         return createError(" в 'getBackground': " + e.toString());
                    //     }
                    // }

                    // --------------------------- fontStyle --------------------------
                    if (colProps.fontStyle) {
                        if (!isString(colProps.fontStyle))
                            return createError("'fontStyle' должен быть строкой");
                        defaultSpan.style.fontStyle = colProps.fontStyle;
                    }
                    if (colProps.getFontStyle) {
                        if (!isFunction(colProps.getFontStyle!))
                            return createError("'getFontStyle' должен быть функцией");

                        try {
                            let value = colProps.getFontStyle(row);
                            if (!isString(value))
                                return createError("'getFontStyle' должен возвращать строку");
                            defaultSpan.style.fontStyle = value;
                        }
                        catch (e) {
                            return createError(" в 'getFontStyle': " + e.toString());
                        }
                    }

                    // --------------------------- fontWeight --------------------------
                    if (colProps.fontWeight) {
                        if (!isString(colProps.fontWeight))
                            return createError("'fontWeight' должен быть строкой");
                        defaultSpan.style.fontWeight = colProps.fontWeight;
                    }
                    if (colProps.getFontWeight) {
                        if (!isFunction(colProps.getFontWeight!))
                            return createError("'getFontWeight' должен быть функцией");

                        try {
                            let value = colProps.getFontWeight(row);
                            if (!isString(value))
                                return createError("'getFontWeight' должен возвращать строку");
                            defaultSpan.style.fontWeight = value;
                        }
                        catch (e) {
                            return createError(" в 'getFontWeight': " + e.toString());
                        }
                    }

                    // --------------------------- fontFamily --------------------------
                    if (colProps.fontFamily) {
                        if (!isString(colProps.fontFamily))
                            return createError("'fontFamily' должен быть строкой");
                        defaultSpan.style.fontFamily = colProps.fontFamily;
                    }
                    if (colProps.getFontFamily) {
                        if (!isFunction(colProps.getFontFamily!))
                            return createError("'getFontFamily' должен быть функцией");

                        try {
                            let value = colProps.getFontFamily(row);
                            if (!isString(value))
                                return createError("'getFontFamily' должен возвращать строку");
                            defaultSpan.style.fontFamily = value;
                        }
                        catch (e) {
                            return createError(" в 'getFontFamily': " + e.toString());
                        }
                    }

                    // --------------------------- fontSize --------------------------
                    if (colProps.fontSize) {
                        if (!isString(colProps.fontSize))
                            return createError("'fontSize' должен быть строкой");
                        defaultSpan.style.fontSize = colProps.fontSize;
                    }
                    if (colProps.getFontSize) {
                        if (!isFunction(colProps.getFontSize!))
                            return createError("'getFontSize' должен быть функцией");

                        try {
                            let value = colProps.getFontSize(row);
                            if (!isString(value))
                                return createError("'getFontSize' должен возвращать строку");
                            defaultSpan.style.fontSize = value;
                        }
                        catch (e) {
                            return createError(" в 'getFontSize': " + e.toString());
                        }
                    }


                    if (colProps.getText) {
                        try {
                            defaultSpan.innerHTML = ReactDOMServer.renderToStaticMarkup(
                                <span>{colProps.getText(row)}</span>);
                        }
                        catch (e) {
                            return createError(" в 'getText': " + e.toString());
                        }
                    }

                    return defaultSpan.outerHTML;
                };

                gridOptions.columns.push(columnOptions);
            }
        }

        if (this.props.onRowKeyDown)
            gridOptions.handlekeyboardnavigation = (event: any) => {
                //console.log("handlekeyboardnavigation", event.keyCode, this.widget[0].offsetParent);
                if (this.getWindow().disabled)
                    return false;
                else
                    return this.props.onRowKeyDown!(this.getSelectedRowIndex(), event.keyCode);
            };

        this.widget.jqxGrid(gridOptions);
        this.widget = $("#" + this.$id);

        if (this.props.onRowDoubleClick)
            this.widget.on("rowdoubleclick", (event: any) => {
                this.props.onRowDoubleClick!(event.args.rowindex);
            });
        else
            this.widget.off("rowdoubleclick");

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

    focus() {
        this.widget.jqxGrid("focus");
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
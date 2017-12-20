import * as  React from "react";
import * as ReactDOMServer from 'react-dom/server';
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";
import {DbGridColumn, IDbGridColumnProps} from "./DbGridColumn";
import {Keycode} from "../utils/Keycode";
import {config} from "../config";
import {isString} from "../utils/isString";
import {isFunction} from "../utils/isFunction";
import {ISchemaQueryProps, SchemaQuery} from "../schema/query/SchemaQuery";
import {getSchemaObjectProps} from "../schema/getSchemaObjectProps";


export interface IDbGridProps extends IComponentProps {
    height?: string | number;
    width?: string | number;
    queryId?: any;
    databaseName?: string;
    rowsheight?: number;
    columnsheight?: number;
    sortable?: boolean;
    onRowDoubleClick?: (rowIndex: number) => void;
    onRowKeyDown?: (rowIndex: number, keyCode: Keycode) => boolean;
    columnsResize?: boolean;
    columnsReorder?: boolean;
    checkboxes?: boolean;

}

export class DbGrid extends Component<IDbGridProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static contextTypes = {
        ...Component.contextTypes,
        bindObj: PropTypes.object
    };

    isDataLoaded: boolean;
    rows: any[];
    query: SchemaQuery;

    lastParentH: number;
    lastParentW: number;
    resizeIntervalId: any;

    async init() {
        if (!isString(this.props.queryId)) {
            let msg = "DbGrid: 'props.queryId' должен быть строкой";
            console.error(msg);
            throw msg;
        }

        let props = await getSchemaObjectProps<ISchemaQueryProps>(this.props.queryId);
        this.query = new SchemaQuery(props);

        //this.updateProps(this.props, true);
    }

    componentDidMount() {


    }

    // updateProps(props: IDbGridProps, create: boolean) {
    //     this.widget = $("#" + this.$id);
    //
    //
    //     let gridOptions: any = omit(props, ["children", "source", "onRowDoubleClick", "onRowKeyDown", "popup", "checkboxes"]);
    //
    //     this.widget.css("position", "absolute");
    //
    //     gridOptions.height = "100%";
    //     gridOptions.width = "100%";
    //
    //     gridOptions.rowsheight = gridOptions.rowsheight || config.grid.rowsHeight;
    //     gridOptions.columnsheight = gridOptions.columnsheight || config.grid.rowsHeight;
    //
    //     if (gridOptions.sortable !== false)
    //         gridOptions.sortable = true;
    //
    //     if (gridOptions.columnsResize !== false)
    //         gridOptions.columnsResize = true;
    //
    //
    //     // заполняем datafields
    //     let count = 0;
    //     let fakeObj: any = {};
    //     let sourceAsArray: any[];
    //     if (Array.isArray(props.source))
    //         sourceAsArray = props.source;
    //     else if (props.source.toArray)
    //         sourceAsArray = props.source.toArray();
    //     else
    //         throw "DbGrid(): неверный формат 'source'";
    //
    //     for (let item of sourceAsArray) {
    //         if (count++ > 10000)
    //             break;
    //         for (let prop in item) {
    //             fakeObj[prop] = true;
    //         }
    //     }
    //
    //     gridOptions.source = {
    //         localdata: props.source,
    //         datatype: "array",
    //         datafields: Object.keys(fakeObj).map((propName: string) => {
    //             return {name: propName}
    //         }),
    //     };
    //
    //     if (this.props.checkboxes) {
    //         gridOptions.selectionmode = "checkbox";
    //     }
    //
    //     gridOptions.columns = [];
    //     for (let col of React.Children.toArray(this.props.children)) {
    //         if ((col as any).type === DbGridColumn) {
    //             let colProps = (col as any).props as IDbGridColumnProps;
    //
    //             // gridOptions.source.datafields.push({name:colProps.});
    //
    //             let columnOptions = omit(colProps, [
    //                 "children",
    //                 "headerText",
    //                 "color",
    //                 "background",
    //                 "fontWeight",
    //                 "fontStyle",
    //                 "fontFamily",
    //                 "getColor",
    //                 "getBackground",
    //                 "getFontSize",
    //                 "getFontWeight",
    //                 "getFontStyle",
    //                 "getFontFamily",
    //                 "getText"
    //             ]);
    //
    //
    //             columnOptions.align = columnOptions.align || "left";
    //
    //             columnOptions.cellsalign = columnOptions.align;
    //
    //             columnOptions.text = colProps.headerText;
    //             if (!columnOptions.text)
    //                 columnOptions.text = columnOptions.datafield || "?datafield";
    //
    //             columnOptions.cellClassName = (rowId: string, datafieldName: any, datafieldValue: any, row: string): string => {
    //
    //                 let className = "";
    //
    //                 if (colProps.background) {
    //                     if (isString(colProps.background))
    //                         className += " background-" + colProps.background + "-important";
    //                     else
    //                         console.error("TreeDbGrid(): background должен быть строкой", colProps.background);
    //                 }
    //                 else if (colProps.getBackground && isFunction(colProps.getBackground!)) {
    //
    //                     try {
    //                         let value = colProps.getBackground(row);
    //                         if (isString(value))
    //                             className += " background-" + value + "-important";
    //                         else
    //                             console.error("TreeDbGrid(): getBackground должен возвращать строку", value);
    //                     }
    //                     catch (e) {
    //                         console.error("TreeDbGrid(): exception в cellClassName", e);
    //                     }
    //                 }
    //
    //                 return className;
    //             };
    //
    //
    //             columnOptions.cellsrenderer = (rowIndex: number, columnfield: any, value: any, defaulthtml: string): string => {
    //
    //                 if (!colProps.getText &&
    //                     !colProps.color && !colProps.getColor &&
    //                     !colProps.background && !colProps.getBackground &&
    //                     !colProps.fontStyle && !colProps.getFontStyle &&
    //                     !colProps.fontWeight && !colProps.getFontWeight &&
    //                     !colProps.fontFamily && !colProps.getFontFamily &&
    //                     !colProps.fontSize && !colProps.getFontSize
    //                 )
    //                     return defaulthtml;
    //
    //                 let el = document.createElement("div");
    //                 el.innerHTML = defaulthtml;
    //                 let defaultSpan = el.childNodes[0] as HTMLElement;
    //
    //                 let createError = (message: string) => {
    //                     defaultSpan.innerText = "ошибка: " + message;
    //                     defaultSpan.title = "ошибка: " + message;
    //                     defaultSpan.style.color = "red";
    //                     console.error(defaultSpan.innerText);
    //                     return defaultSpan.outerHTML;
    //                 };
    //
    //                 let row = props.source[rowIndex];
    //
    //                 // --------------------------- color --------------------------
    //                 if (colProps.color) {
    //                     if (!isString(colProps.color))
    //                         return createError("'color' должен быть строкой");
    //                     defaultSpan.style.color = colProps.color;
    //                 }
    //                 if (colProps.getColor) {
    //                     if (!isFunction(colProps.getColor!))
    //                         return createError("'getColor' должен быть функцией");
    //
    //                     try {
    //                         let value = colProps.getColor(row);
    //                         if (!isString(value))
    //                             return createError("'getColor' должен возвращать строку");
    //                         defaultSpan.style.color = value;
    //                     }
    //                     catch (e) {
    //                         return createError(" в 'getColor': " + e.toString());
    //                     }
    //                 }
    //
    //                 // --------------------------- fontStyle --------------------------
    //                 if (colProps.fontStyle) {
    //                     if (!isString(colProps.fontStyle))
    //                         return createError("'fontStyle' должен быть строкой");
    //                     defaultSpan.style.fontStyle = colProps.fontStyle;
    //                 }
    //                 if (colProps.getFontStyle) {
    //                     if (!isFunction(colProps.getFontStyle!))
    //                         return createError("'getFontStyle' должен быть функцией");
    //
    //                     try {
    //                         let value = colProps.getFontStyle(row);
    //                         if (!isString(value))
    //                             return createError("'getFontStyle' должен возвращать строку");
    //                         defaultSpan.style.fontStyle = value;
    //                     }
    //                     catch (e) {
    //                         return createError(" в 'getFontStyle': " + e.toString());
    //                     }
    //                 }
    //
    //                 // --------------------------- fontWeight --------------------------
    //                 if (colProps.fontWeight) {
    //                     if (!isString(colProps.fontWeight))
    //                         return createError("'fontWeight' должен быть строкой");
    //                     defaultSpan.style.fontWeight = colProps.fontWeight;
    //                 }
    //                 if (colProps.getFontWeight) {
    //                     if (!isFunction(colProps.getFontWeight!))
    //                         return createError("'getFontWeight' должен быть функцией");
    //
    //                     try {
    //                         let value = colProps.getFontWeight(row);
    //                         if (!isString(value))
    //                             return createError("'getFontWeight' должен возвращать строку");
    //                         defaultSpan.style.fontWeight = value;
    //                     }
    //                     catch (e) {
    //                         return createError(" в 'getFontWeight': " + e.toString());
    //                     }
    //                 }
    //
    //                 // --------------------------- fontFamily --------------------------
    //                 if (colProps.fontFamily) {
    //                     if (!isString(colProps.fontFamily))
    //                         return createError("'fontFamily' должен быть строкой");
    //                     defaultSpan.style.fontFamily = colProps.fontFamily;
    //                 }
    //                 if (colProps.getFontFamily) {
    //                     if (!isFunction(colProps.getFontFamily!))
    //                         return createError("'getFontFamily' должен быть функцией");
    //
    //                     try {
    //                         let value = colProps.getFontFamily(row);
    //                         if (!isString(value))
    //                             return createError("'getFontFamily' должен возвращать строку");
    //                         defaultSpan.style.fontFamily = value;
    //                     }
    //                     catch (e) {
    //                         return createError(" в 'getFontFamily': " + e.toString());
    //                     }
    //                 }
    //
    //                 // --------------------------- fontSize --------------------------
    //                 if (colProps.fontSize) {
    //                     if (!isString(colProps.fontSize))
    //                         return createError("'fontSize' должен быть строкой");
    //                     defaultSpan.style.fontSize = colProps.fontSize;
    //                 }
    //                 if (colProps.getFontSize) {
    //                     if (!isFunction(colProps.getFontSize!))
    //                         return createError("'getFontSize' должен быть функцией");
    //
    //                     try {
    //                         let value = colProps.getFontSize(row);
    //                         if (!isString(value))
    //                             return createError("'getFontSize' должен возвращать строку");
    //                         defaultSpan.style.fontSize = value;
    //                     }
    //                     catch (e) {
    //                         return createError(" в 'getFontSize': " + e.toString());
    //                     }
    //                 }
    //
    //
    //                 if (colProps.getText) {
    //                     try {
    //                         defaultSpan.innerHTML = ReactDOMServer.renderToStaticMarkup(
    //                             <span>{colProps.getText(row)}</span>);
    //                     }
    //                     catch (e) {
    //                         return createError(" в 'getText': " + e.toString());
    //                     }
    //                 }
    //
    //                 return defaultSpan.outerHTML;
    //             };
    //
    //             gridOptions.columns.push(columnOptions);
    //         }
    //     }
    //
    //     if (this.props.onRowKeyDown)
    //         gridOptions.handlekeyboardnavigation = (event: any) => {
    //             //console.log("handlekeyboardnavigation", event.keyCode, this.widget[0].offsetParent);
    //             if (this.getWindow().disabled)
    //                 return false;
    //             else
    //                 return this.props.onRowKeyDown!(this.getSelectedRowIndex(), event.keyCode);
    //         };
    //
    //     this.widget.jqxGrid(gridOptions);
    //     this.widget = $("#" + this.$id);
    //
    //     if (this.props.onRowDoubleClick)
    //         this.widget.on("rowdoubleclick", (event: any) => {
    //             this.props.onRowDoubleClick!(event.args.rowindex);
    //         });
    //     else
    //         this.widget.off("rowdoubleclick");
    //
    //     this.resizeIntervalId = setInterval(() => {
    //         let newH = this.widget.parent().height();
    //         let newW = this.widget.parent().width();
    //
    //         // отановка таймера resize, если DbGrid удалена
    //         if ($("#" + this.$id).length !== 1) {
    //             clearInterval(this.resizeIntervalId);
    //         }
    //
    //         if (newH > 0 && (this.lastParentH !== newH || this.lastParentW !== newW)) {
    //             this.lastParentH = newH;
    //             this.lastParentW = newW;
    //             this.widget.jqxGrid({height: newH, width: newW});
    //         }
    //     }, 200);
    // }

    clearSelection() {
        this.widget.jqxGrid("clearselection");
    }

    getSelectedRowIndex(): number {
        return this.widget.jqxGrid("getselectedrowindex");
    }

    // getSelectedRow(): any {
    //     return this.props.source.get(this.getSelectedRowIndex());
    // }

    getSelectedRowIndexes(): number[] {
        return this.widget.jqxGrid("getselectedrowindexes");
    }

    // getSelectedRows(): any[] {
    //     let propsSource = this.props.source;
    //     return this.getSelectedRowIndexes().map((itemIndex) => propsSource.get(itemIndex));
    // }

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
        //console.log("render DbGrid");

        if (!this.isDataLoaded) {
            return (
                <div
                    style={{
                        position: "relative",
                        width: this.props.width || "100%",
                        height: this.props.height || "initial",
                        border: "1px solid red",
                    }}>
                    загрузка идет...
                </div>
            )
        }
        else {
            return (
                <div
                    style={{
                        position: "relative",
                        width: this.props.width || "100%",
                        height: this.props.height || "initial",
                        border: "0px solid red",
                    }}>
                    <div id={this.$id}/>
                </div>
            )
        }
    }

}
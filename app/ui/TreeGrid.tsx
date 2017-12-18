import * as  React from "react";
import * as ReactDOMServer from 'react-dom/server';
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";
import {Keycode} from "../utils/Keycode";
import {ITreeGridColumnProps, TreeGridColumn} from "./TreeGridColumn";
import {isString} from "../utils/isString";
import {isFunction} from "../utils/isFunction";
import {getRandomString} from "../utils/getRandomString";

// запрещенные имена в row: data,expanded,leaf,level,parent,records,uid,_visible

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
    onRowDoubleClick?: (row: any) => void;
    onRowKeyDown?: (rowIndex: number, keyCode: Keycode) => boolean;
    popup?: React.ReactNode | ((rowItem: any) => Promise<React.ReactNode>);
    icons?: boolean;
    checkboxes?: boolean;
    hierarchicalCheckboxes?: boolean;
    enableHover?: boolean;
    expandAll?: boolean;
    columnsResize?: boolean;
    columnsReorder?: boolean;

}

export interface ITreeGridNode {
    parent: any;
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

    static reservedRowPropNames = ["data", "expanded", "leaf", "level", "parent", "records", "uid", "_visible"];

    static setRandomKeysInDataSourceObject(obj: any, keyPropName: string) {
        if (obj === null)
            return;
        if (obj === undefined)
            return;

        if (!obj[keyPropName]) {
            obj[keyPropName] = getRandomString();
        }

        if (Array.isArray(obj)) {
            for (let item of obj) {
                TreeGrid.setRandomKeysInDataSourceObject(item, keyPropName);
            }
        }
        else if (typeof obj === "object") {
            for (let prop in obj) {
                if (typeof obj[prop] === "object") {
                    TreeGrid.setRandomKeysInDataSourceObject(obj[prop], keyPropName);
                }
            }
        }

        return null;
    }

    static removeRandomKeysInDataSourceObject(obj: any, keyPropName: string) {
        if (obj === null)
            return;
        if (obj === undefined)
            return;

        if (obj[keyPropName]) {
            delete obj[keyPropName];
        }

        if (Array.isArray(obj)) {
            for (let item of obj) {
                TreeGrid.removeRandomKeysInDataSourceObject(item, keyPropName);
            }
        }
        else if (typeof obj === "object") {
            for (let prop in obj) {
                if (typeof obj[prop] === "object") {
                    TreeGrid.removeRandomKeysInDataSourceObject(obj[prop], keyPropName);
                }
            }
        }

        return null;
    }

    static findRowInDataSourceObject(obj: any, keyPropName: string, keyValue: any): any {
        if (obj === null)
            return null;
        if (obj === undefined)
            return null;

        if (obj[keyPropName] === keyValue)
            return obj;

        if (Array.isArray(obj)) {
            for (let item of obj) {
                let result = TreeGrid.findRowInDataSourceObject(item, keyPropName, keyValue);
                if (result)
                    return result;
            }
        }
        else if (typeof obj === "object") {
            for (let prop in obj) {
                if (prop === keyPropName && obj[prop] === keyValue)
                    return obj;
                else if (typeof obj[prop] === "object") {
                    let result = TreeGrid.findRowInDataSourceObject(obj[prop], keyPropName, keyValue);
                    if (result)
                        return result;
                }
            }
        }

        return null;
    }

    lastParentH: number;
    lastParentW: number;
    resizeIntervalId: any;

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);

        this.resizeIntervalId = setInterval(() => {
            let newH = this.widget.parent().height();
            let newW = this.widget.parent().width();

            // отановка таймера resize, если TreeGrid удалена
            if ($("#" + this.$id).length !== 1) {
                clearInterval(this.resizeIntervalId);
            }

            if (newH > 0 && (this.lastParentH !== newH || this.lastParentW !== newW)) {
                this.lastParentH = newH;
                this.lastParentW = newW;
                this.widget.jqxTreeGrid({height: newH, width: newW});
            }
        }, 200);

        if (this.props.expandAll)
            this.expandAll();
    }

    updateProps(props: ITreeGridProps, create: boolean) {
        this.widget.css("position", "absolute");

        let treeGridOptions: any = omit(props, ["children", "source", "onRowDoubleClick", "onRowKeyDown", "popup", "expandAll"]);
        treeGridOptions.height = "100%";
        treeGridOptions.width = "100%";

        if (treeGridOptions.sortable !== false)
            treeGridOptions.sortable = true;

        if (treeGridOptions.columnsResize !== false)
            treeGridOptions.columnsResize = true;


        treeGridOptions.source = new (($ as any).jqx.dataAdapter)(props.source);


        treeGridOptions.columns = [];
        for (let col of React.Children.toArray(this.props.children)) {
            if ((col as any).type === TreeGridColumn) {
                let colProps = (col as any).props as ITreeGridColumnProps;

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

                // "key1", datafield, row,  row[datafield]
                columnOptions.cellsrenderer = (rowId: string, datafieldName: any, datafieldValue: any, row: string, defaultText: string): string => {
                    //console.log("========================>>>>>>>>>>>>>>", rowId, row, value, p4, defaultText);
                    //if (rowId) return defaultText;
                    if (!colProps.getText &&
                        !colProps.color && !colProps.getColor &&
                        !colProps.background && !colProps.getBackground &&
                        !colProps.fontStyle && !colProps.getFontStyle &&
                        !colProps.fontWeight && !colProps.getFontWeight &&
                        !colProps.fontFamily && !colProps.getFontFamily &&
                        !colProps.fontSize && !colProps.getFontSize
                    )
                        return defaultText;

                    //
                    // let el = document.createElement("div");
                    // el.innerHTML = defaulthtml;
                    // let defaultSpan = el.childNodes[0] as HTMLElement;
                    //
                    let createError = (message: string) => {
                        let text = "ошибка: " + message;
                        console.error(text);
                        return ReactDOMServer.renderToStaticMarkup(<span title={text}
                                                                         style={{color: "red"}}>{text}</span>)
                    };
                    //
                    // let row = props.source[rowIndex];
                    //

                    let style: any = {};

                    // --------------------------- color --------------------------
                    if (colProps.color) {
                        if (!isString(colProps.color))
                            return createError("'color' должен быть строкой");
                        style.color = colProps.color;
                    }
                    if (colProps.getColor) {
                        if (!isFunction(colProps.getColor!))
                            return createError("'getColor' должен быть функцией");

                        try {
                            let value = colProps.getColor(row);
                            if (!isString(value))
                                return createError("'getColor' должен возвращать строку");
                            style.color = value;
                        }
                        catch (e) {
                            return createError(" в 'getColor': " + e.toString());
                        }
                    }

                    // --------------------------- background --------------------------
                    // if (colProps.background) {
                    //     if (!isString(colProps.background))
                    //         return createError("'background' должен быть строкой");
                    //     style.background = colProps.background;
                    // }
                    // if (colProps.getBackground) {
                    //     if (!isFunction(colProps.getBackground!))
                    //         return createError("'getBackground' должен быть функцией");
                    //
                    //     try {
                    //         let value = colProps.getBackground(row);
                    //         if (!isString(value))
                    //             return createError("'getBackground' должен возвращать строку");
                    //         style.background = value;
                    //     }
                    //     catch (e) {
                    //         return createError(" в 'getBackground': " + e.toString());
                    //     }
                    // }

                    // --------------------------- fontStyle --------------------------
                    if (colProps.fontStyle) {
                        if (!isString(colProps.fontStyle))
                            return createError("'fontStyle' должен быть строкой");
                        style.fontStyle = colProps.fontStyle;
                    }
                    if (colProps.getFontStyle) {
                        if (!isFunction(colProps.getFontStyle!))
                            return createError("'getFontStyle' должен быть функцией");

                        try {
                            let value = colProps.getFontStyle(row);
                            if (!isString(value))
                                return createError("'getFontStyle' должен возвращать строку");
                            style.fontStyle = value;
                        }
                        catch (e) {
                            return createError(" в 'getFontStyle': " + e.toString());
                        }
                    }

                    // --------------------------- fontWeight --------------------------
                    if (colProps.fontWeight) {
                        if (!isString(colProps.fontWeight))
                            return createError("'fontWeight' должен быть строкой");
                        style.fontWeight = colProps.fontWeight;
                    }
                    if (colProps.getFontWeight) {
                        if (!isFunction(colProps.getFontWeight!))
                            return createError("'getFontWeight' должен быть функцией");

                        try {
                            let value = colProps.getFontWeight(row);
                            if (!isString(value))
                                return createError("'getFontWeight' должен возвращать строку");
                            style.fontWeight = value;
                        }
                        catch (e) {
                            return createError(" в 'getFontWeight': " + e.toString());
                        }
                    }

                    // --------------------------- fontFamily --------------------------
                    if (colProps.fontFamily) {
                        if (!isString(colProps.fontFamily))
                            return createError("'fontFamily' должен быть строкой");
                        style.fontFamily = colProps.fontFamily;
                    }
                    if (colProps.getFontFamily) {
                        if (!isFunction(colProps.getFontFamily!))
                            return createError("'getFontFamily' должен быть функцией");

                        try {
                            let value = colProps.getFontFamily(row);
                            if (!isString(value))
                                return createError("'getFontFamily' должен возвращать строку");
                            style.fontFamily = value;
                        }
                        catch (e) {
                            return createError(" в 'getFontFamily': " + e.toString());
                        }
                    }

                    // --------------------------- fontSize --------------------------
                    if (colProps.fontSize) {
                        if (!isString(colProps.fontSize))
                            return createError("'fontSize' должен быть строкой");
                        style.fontSize = colProps.fontSize;
                    }
                    if (colProps.getFontSize) {
                        if (!isFunction(colProps.getFontSize!))
                            return createError("'getFontSize' должен быть функцией");

                        try {
                            let value = colProps.getFontSize(row);
                            if (!isString(value))
                                return createError("'getFontSize' должен возвращать строку");
                            style.fontSize = value;
                        }
                        catch (e) {
                            return createError(" в 'getFontSize': " + e.toString());
                        }
                    }


                    if (colProps.getText) {
                        try {
                            return ReactDOMServer.renderToStaticMarkup(<span
                                style={style}>{colProps.getText(row)}</span>)
                        }
                        catch (e) {
                            return createError(" в 'getText': " + e.toString());
                        }
                    }
                    else
                        return ReactDOMServer.renderToStaticMarkup(<span style={style}>{defaultText}</span>)
                };

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

        try {
            this.widget.jqxTreeGrid(treeGridOptions);
        }
        catch (error) {
            console.error(error);
        }
        this.widget = $("#" + this.$id);

        if (this.props.onRowDoubleClick)
            this.widget.on("rowDoubleClick", (event: any) => {
                this.props.onRowDoubleClick!(event.args.row);
            });
        else
            this.widget.off("rowDoubleClick");

    }

    getCheckedRows(): any[] {
        return this.widget.jqxTreeGrid("getCheckedRows");
    }

    // clearSelection() {
    //     this.widget.jqxTreeGrid("clearSelection");
    // }
    //
    //
    // selectRow(rowId: string) {
    //     this.widget.jqxTreeGrid("selectRow", rowId);
    // }
    //
    // unselectRow(rowId: string) {
    //     this.widget.jqxTreeGrid("unselectRow", rowId);
    // }

    focus() {
        this.widget.jqxTreeGrid("focus");
    }

    refresh() {
        this.widget.jqxTreeGrid("refresh");
        this.widget.jqxTreeGrid("render");
    }

    //('addRow', null, { "name": "Go jqWidgets!" }, 'first', rowKey);
    addRow(rowKey: string, row: any, position: ("first" | "last"), parentKey: string) {
        this.widget.jqxTreeGrid("addRow", rowKey, row, position, parentKey);
    }

    updateRow(rowId: string, row: any) {
        this.widget.jqxTreeGrid("updateRow", rowId, row);
    }

    expandAll() {
        this.widget.jqxTreeGrid("expandAll");
    }

    collapseAll() {
        this.widget.jqxTreeGrid("collapseAll ");
    }

    getSelection(): any[] {
        return this.widget.jqxTreeGrid("getSelection");
    }

    render() {
        //console.log("render TreeGrid");

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
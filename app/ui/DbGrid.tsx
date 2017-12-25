import * as  React from "react";
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {Keycode} from "../utils/Keycode";
import {isString} from "../utils/isString";
import {ISchemaQueryProps, SchemaQuery} from "../schema/query/SchemaQuery";
import {getSchemaObjectProps} from "../schema/getSchemaObjectProps";
import {throwError} from "../utils/throwError";
import {omit} from "../utils/omit";
import {config} from "../config";
import {showError} from "./modals/showError";
import {addToolbarIconItem} from "./Toolbar";
import {appState} from "../AppState";
import {DbGridBaseFilter, DbGridEqualFilter, DbGridNotEqualFilter} from "./DbGridFilter";


export interface IDbGridProps extends IComponentProps {
    height?: string | number;
    width?: string | number;
    queryId?: any;
    autoLoad?: boolean;
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

    isJqxGridInitialized: boolean;
    isDataLoaded: boolean;
    isDataSourceAssigned: boolean;

    rows: any[];
    query: SchemaQuery;

    // lastParentH: number;
    // lastParentW: number;
    // resizeIntervalId: any;
    error: string | null = null;

    filterGroup: any;

    focusedCellDataField: string;
    focusedCellRow: any;
    activeFilters: DbGridBaseFilter[] = [];


    async loadRows(): Promise<void> {
        this.error = null;
        try {
            if (!isString(this.props.queryId)) {
                let msg = "DbGrid: 'props.queryId' должен быть строкой";
                throwError(msg);
            }

            let props = await getSchemaObjectProps<ISchemaQueryProps>(this.props.queryId);
            this.query = new SchemaQuery(props);
            this.rows = await this.query.execute();
            this.isDataLoaded = true;
            this.isDataSourceAssigned = false;
        }
        catch (e) {
            this.error = e.toString();
            showError(e);
        }

    }

    async initializeJqxGrid() {
        if (!this.isJqxGridInitialized) {
            this.widget = $("#" + this.$id);

            let gridOptions: any = omit(this.props, ["children", "source", "onRowDoubleClick", "onRowKeyDown", "popup", "checkboxes", "queryId", "autoLoad", "databaseName"]);

            this.widget.css("position", "absolute");

            gridOptions.enableanimations = false;
            gridOptions.enablehover = false;
            gridOptions.height = "100%";
            gridOptions.width = "100%";  // не убирать, несмотря на resizeIntervalId, иначе неприятная анимация при рендеринге
            gridOptions.showfiltercolumnbackground = false;
            gridOptions.showsortcolumnbackground = false;
            gridOptions.showpinnedcolumnbackground = false;

            gridOptions.selectionmode = "singlecell";

            //gridOptions.width = "100%";
            //gridOptions.filter = this.filterFunction;
            gridOptions.filterable = false;

            gridOptions.rowsheight = gridOptions.rowsheight || config.grid.rowsHeight;
            gridOptions.columnsheight = gridOptions.columnsheight || config.grid.rowsHeight;

            if (gridOptions.sortable !== false)
                gridOptions.sortable = true;

            if (gridOptions.columnsResize !== false)
                gridOptions.columnsresize = true;

            if (gridOptions.columnsReorder !== false)
                gridOptions.columnsreorder = true;

            if (this.props.checkboxes) {
                gridOptions.selectionmode = "checkbox";
            }

            this.widget.jqxGrid(gridOptions);
            this.widget = $("#" + this.$id);

            // this.filterGroup = new ($ as any).jqx.filter();
            // var filter_or_operator = 0;
            // var filtervalue = 'петербург';
            // var filtercondition = 'contains';
            // var filter1 = this.filterGroup.createfilter('stringfilter', filtervalue, filtercondition);
            // this.filterGroup.addfilter(filter_or_operator, filter1);
            // this.widget.jqxGrid('addfilter', 'Название', this.filterGroup);
            // // apply the filters.
            // this.widget.jqxGrid('applyfilters');


            this.isJqxGridInitialized = true;

            let lastParentW = 0;
            let resizeIntervalId = setInterval(() => {
                let newW = this.widget.parent().width();

                // отановка таймера resize, если TreeGrid удалена
                if ($("#" + this.$id).length !== 1) {
                    clearInterval(resizeIntervalId);
                }

                if (lastParentW !== newW) {
                    lastParentW = newW;
                    this.widget.jqxGrid({width: newW - 2});
                }
            }, 200);

            this.widget.on("cellselect", (event: any) => {
                this.focusedCellRow = this.getRowByIndex(event.args.rowindex);
                this.focusedCellDataField = event.args.datafield;
                this.resetToolbar();
                console.log("cellselect----------->", this.focusedCellDataField, this.focusedCellRow);
                // // event arguments.
                // var args = event.args;
                // // get the column's text.
                // var column = $("#jqxGrid").jqxGrid('getcolumn', event.args.datafield).text;
                // // column data field.
                // var dataField = event.args.datafield;
                // // row's bound index.
                // var rowBoundIndex = event.args.rowindex;
                // // cell value
                // var value = args.value;
            });


        }
    }

    // filterFunction = (cellValue: any, rowData: any, dataField: string, filterGroup: any, defaultFilterResult: any): boolean => {
    //     // implements a custom filter for the "name" field.
    //     if (dataField === "Название") {
    //         return rowData["Название"].indexOf("Услуги") > -1;
    //     }
    //     else
    //         return true;
    // };

    resetToolbar() {

        if (appState.desktop.toolbar.activeElement !== this) {
            appState.desktop.clearToolbarFocusedGroups();
            appState.desktop.toolbar.activeElement = this;

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid",
                type: "icon",
                tooltip: "обновить список (F5)",
                id: "refresh",
                icon: config.dbGrid.toolbar.reloadIcon
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-find",
                type: "icon",
                tooltip: "поиск по колонке с начала списка (F2)",
                id: "find",
                icon: config.dbGrid.toolbar.findIcon
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-find",
                type: "icon",
                tooltip: "поиск по колонке вперед (F3)",
                id: "find-next",
                icon: config.dbGrid.toolbar.findNextIcon
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-find",
                type: "icon",
                tooltip: "поиск по колонке назад (Shift-F3)",
                id: "find-prev",
                icon: config.dbGrid.toolbar.findPrevIcon
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-filter",
                type: "icon",
                tooltip: "включить фильтр",
                id: "filter",
                icon: config.dbGrid.toolbar.filterIcon
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-filter",
                type: "icon",
                tooltip: "фильтр по строке/подстроке",
                id: "filter-input",
                icon: config.dbGrid.toolbar.filterInputIcon
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-filter",
                type: "icon",
                tooltip: "фильтр по выделенному значению",
                id: "filter-plus",
                icon: config.dbGrid.toolbar.filterPlusIcon,
                onClick: async () => {
                    let queryColumn = this.query.getColumnByCaption(this.focusedCellDataField);
                    let cellValue = this.focusedCellRow[this.focusedCellDataField];
                    let dataType = queryColumn.getDataType();
                    let filter = new DbGridEqualFilter(dataType, cellValue, this.focusedCellDataField);
                    this.activeFilters.push(filter);
                    this.setFilteredDataSource();
                }

            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-filter",
                type: "icon",
                tooltip: "фильтр - все кроме выделенного значения",
                id: "filter-minus",
                icon: config.dbGrid.toolbar.filterMinusIcon,
                onClick: async () => {
                    let queryColumn = this.query.getColumnByCaption(this.focusedCellDataField);
                    let cellValue = this.focusedCellRow[this.focusedCellDataField];
                    let dataType = queryColumn.getDataType();
                    let filter = new DbGridNotEqualFilter(dataType, cellValue, this.focusedCellDataField);
                    this.activeFilters.push(filter);
                    this.setFilteredDataSource();
                }

            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-filter",
                type: "icon",
                tooltip: "сброс всех фильтров",
                id: "filter-reset",
                icon: config.dbGrid.toolbar.filterResetIcon,
                onClick: async () => {
                    this.activeFilters.length = 0;
                    this.setFilteredDataSource();
                }
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-selection",
                type: "icon",
                tooltip: "показать колонку для выбора записей",
                id: "checkboxes",
                icon: config.dbGrid.toolbar.checkboxesIcon
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-selection",
                type: "icon",
                tooltip: "выбрать все записи",
                id: "checkboxes-all",
                icon: config.dbGrid.toolbar.checkboxesAllIcon
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-selection",
                type: "icon",
                tooltip: "снять выбор",
                id: "checkboxes-none",
                icon: config.dbGrid.toolbar.checkboxesNoneIcon
            });


            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-sort",
                type: "icon",
                tooltip: "сортировка по возрастанию",
                id: "sort-asc",
                icon: config.dbGrid.toolbar.sortAscIcon,
                onClick: async () => {
                    this.sortByColumn(this.focusedCellDataField, "asc");
                }

            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-sort",
                type: "icon",
                tooltip: "сортировка по убыванию",
                id: "sort-desc",
                icon: config.dbGrid.toolbar.sortDescIcon,
                onClick: async () => {
                    this.sortByColumn(this.focusedCellDataField, "desc");
                }
            });

            addToolbarIconItem(appState.desktop.toolbar, {
                group: "focused-grid-sort",
                type: "icon",
                tooltip: "отмена сортировки",
                id: "sort-reset",
                icon: config.dbGrid.toolbar.sortResetIcon,
                onClick: async () => {
                    this.removeSort();
                }
            });
            appState.desktop.forceUpdate();
            appState.desktop.forceUpdate();
        }

    }

    async createColumns() {
        let columns: any[] = [];
        for (let col of this.query.columns) {
            let columnOptions: any = {};
            //columnOptions.resizable = true;
            //columnOptions.draggable = true;
            columnOptions.width = 100;
            columnOptions.filtertype = "input";
            columnOptions.text = col.props.fieldCaption || col.props.fieldSource;
            columnOptions.datafield = col.props.fieldCaption || col.props.fieldSource;
            columns.push(columnOptions);
        }
        this.widget.jqxGrid({columns: columns});

    }


    setFilteredDataSource() {

        let filteredRows = this.rows[0].rows.filter((row: any) => {
            for (let filter of this.activeFilters) {
                if (!filter.filter(row))
                    return false;
            }
            return true;
        });

        let source = {
            localdata: filteredRows,
            datatype: "local",
            // datafields: Object.keys(fakeObj).map((propName: string) => {
            //     return {name: propName}
            // }),
        };

        this.widget.jqxGrid({source: source});
        this.autoResizeColumns();

    }

    async setDataSource() {
        //this.updateProps(this.props, true);
        console.log("setDataSource");
        if (!this.isDataSourceAssigned) {
            await this.query.createTree();
            await this.createColumns();

            this.setFilteredDataSource();
            this.autoResizeColumns();

            this.forceUpdate();
            this.isDataSourceAssigned = true;
        }

    }

    async componentDidUpdate() {
        console.log("componentDidUpdate", this.rows)
        if (this.isDataLoaded) {
            await this.initializeJqxGrid();
            await this.setDataSource();
        }
    }

    async componentDidMount() {

        if (this.props.autoLoad) {
            await this.loadRows();
            this.forceUpdate();
            console.log("componentDidMount loaded rows", this.rows)
        }

    }

    updateProps(props: IDbGridProps, create: boolean) {

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
    }

    clearSelection() {
        this.widget.jqxGrid("clearselection");
    }

    getSelectedRowIndex(): number {
        return this.widget.jqxGrid("getselectedrowindex");
    }

    getRowByIndex(index: number): any {
        return this.widget.jqxGrid('getrowdata', index);
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

    autoResizeColumns() {
        this.widget.jqxGrid("autoresizecolumns", "cells");
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

    sortByColumn(columnCaption: string, ascDesc: "asc" | "desc" = "asc"): any {
        return this.widget.jqxGrid("sortby", columnCaption, ascDesc);
    }

    removeSort() {
        this.widget.jqxGrid("removesort");
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
                        border: "1px solid silver",
                        color: this.error ? "red" : "transparent",
                        backgroundColor: this.error ? "#ffe6e1a6" : "initial",
                        textAlign: "center",
                        verticalAlign: "middle",
                        lineHeight: 5
                    }}>
                    ошибка загрузки: {this.error}
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
                    }}>
                    <div id={this.$id}/>
                </div>
            )
        }
    }

}
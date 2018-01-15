import * as  React from "react";
import {appState} from "../AppState";
import {Window} from "./Window";
import {getRandomString} from "../utils/getRandomString";
import {replaceAll} from "../utils/replaceAll";
import {IComponentProps} from "./Component";
import {SchemaExplorerWindow} from "../admin/SchemaExplorerWindow";
import {getSHA1hex} from "../utils/getSHA1hex";
import {Menu} from "./Menu";
import {MenuItem} from "./MenuItem";
import {config} from "../config";
import {MenuSeparator} from "./MenuSeparator";
import {TestsExplorerWindow} from "../admin/TestsExplorerWindow";
import {throwError} from "../utils/throwError";
import {clearToolbarFocusedGroups, IToolbarProps, Toolbar} from "./Toolbar";
import {SelectColorWindow} from "../admin/SelectColorWindow";
import {doLogin} from "../api/doLogin";


export interface IDesktopProps extends IComponentProps {
    //schemaPageId: string;
    //form: WrappedFormUtils;
}

declare var Babel: any;

export class Desktop extends React.Component<IDesktopProps, any> {

    componentDidMount() {
        appState.desktop = this;
        //this.__createT();
        this.forceUpdate();
    }

    w: Window;
    b: string = "бутон2";
    t: string = "title999";

    windows: React.ReactNode[] = [];

    toolbar: IToolbarProps = {
        groups: [
            "focused-input",
            "focused-grid", "focused-grid-selection", "focused-grid-find", "focused-grid-filter", "focused-grid-sort"
        ],
        items: [],
    };

    clearToolbarFocusedGroups() {
        clearToolbarFocusedGroups(this.toolbar);
    }


    renderWindows(): React.ReactNode {
        return this.windows.slice();
    }


    // __createT() {
    //     clearToolbar(this.toolbar);
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid",
    //         type: "icon",
    //         tooltip: "обновить список (F5)",
    //         id: "x0",
    //         icon: config.dbGrid.toolbar.reloadIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-find",
    //         type: "icon",
    //         tooltip: "поиск по колонке с начала списка (F2)",
    //         id: "x1",
    //         icon: config.dbGrid.toolbar.findIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-find",
    //         type: "icon",
    //         tooltip: "поиск по колонке вперед (F3)",
    //         id: "x2",
    //         icon: config.dbGrid.toolbar.findNextIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-find",
    //         type: "icon",
    //         tooltip: "поиск по колонке назад (Shift-F3)",
    //         id: "x3",
    //         icon: config.dbGrid.toolbar.findPrevIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-filter",
    //         type: "icon",
    //         tooltip: "поиск по колонке с начала списка (F2)",
    //         id: "x12",
    //         icon: config.dbGrid.toolbar.filterIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-filter",
    //         type: "icon",
    //         tooltip: "поиск по колонке вперед (F3)",
    //         id: "x22",
    //         icon: config.dbGrid.toolbar.filterInputIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-filter",
    //         type: "icon",
    //         tooltip: "поиск по колонке назад (Shift-F3)",
    //         id: "x2",
    //         icon: config.dbGrid.toolbar.filterPlusIcon
    //     });
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-filter",
    //         type: "icon",
    //         tooltip: "поиск по колонке назад (Shift-F3)",
    //         id: "x2",
    //         icon: config.dbGrid.toolbar.filterMinusIcon
    //     });
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-filter",
    //         type: "icon",
    //         tooltip: "поиск по колонке назад (Shift-F3)",
    //         id: "x2",
    //         icon: config.dbGrid.toolbar.filterResetIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-selection",
    //         type: "icon",
    //         tooltip: "поиск по колонке назад (Shift-F3)",
    //         id: "checkboxes",
    //         icon: config.dbGrid.toolbar.checkboxesIcon
    //     });
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-selection",
    //         type: "icon",
    //         tooltip: "поиск по колонке назад (Shift-F3)",
    //         id: "checkboxes-all",
    //         icon: config.dbGrid.toolbar.checkboxesAllIcon
    //     });
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-selection",
    //         type: "icon",
    //         tooltip: "поиск по колонке назад (Shift-F3)",
    //         id: "checkboxes-none",
    //         icon: config.dbGrid.toolbar.checkboxesNoneIcon
    //     });
    //
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-sort",
    //         type: "icon",
    //         tooltip: "сортировка по возрастанию",
    //         id: "sort-asc",
    //         icon: config.dbGrid.toolbar.sortAscIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-sort",
    //         type: "icon",
    //         tooltip: "сортировка по убыванию",
    //         id: "sort-desc",
    //         icon: config.dbGrid.toolbar.sortDescIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-grid-sort",
    //         type: "icon",
    //         tooltip: "отмена сортировки",
    //         id: "sort-reset",
    //         icon: config.dbGrid.toolbar.sortResetIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-input-sort",
    //         type: "icon",
    //         tooltip: "сортировка по убыванию",
    //         id: "sort-desc",
    //         icon: config.dbGrid.toolbar.sortDescIcon
    //     });
    //
    //     addToolbarIconItem(this.toolbar, {
    //         group: "focused-input-sort",
    //         type: "icon",
    //         tooltip: "отмена сортировки",
    //         id: "sort-reset",
    //         icon: config.dbGrid.toolbar.sortResetIcon
    //     });
    // }


    renderTaskBarItems(): React.ReactNode {

        let items: any[] = [];
        let winIdList: string[] = $(".jqx-window").toArray().map((win: any) => $(win).attr("id")!);

        // активно окно с наибольшим z-index
        let maxZIndex = -1;
        for (let win of $(".jqx-window").toArray()) {
            let zIndex = parseInt($(win).css("z-index"));
            maxZIndex = Math.max(maxZIndex, zIndex);
        }

        for (let winId of winIdList) {

            // модальные окна пропускаем
            let zIndex = parseInt($("#" + winId).css("z-index"));
            if (zIndex >= 1800)
                continue;

            let winTitle = $("#" + winId + "_win_title").text();
            let winIcon = $("#" + winId + "_win_icon").attr("src");

            let className = "buhta-taskbar-item";
            if (zIndex === maxZIndex)
                className += " active";

            items.push(
                <div
                    key={winId}
                    className={className}
                    title={winTitle}
                    style={{
                        marginRight: 2,
                        marginBottom: 2,
                        display: "inline-block",
                    }}
                    onClick={() => {
                        ($("#" + winId) as any).jqxWindow("bringToFront");
                        this.forceUpdate();
                    }}
                >
                    <table style={{height: 22}}>
                        <tbody>
                        <tr>
                            <td style={{verticalAlign: "middle", paddingLeft: 3, paddingTop: 2}}>
                                <img src={winIcon} width={16} height={16}/>
                            </td>
                            <td style={{verticalAlign: "middle", paddingLeft: 3}}>
                                <div
                                    style={{
                                        cursor: "default",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        maxWidth: 200,
                                        minWidth: 50,
                                        paddingRight: 3
                                    }}
                                >
                                    {winTitle}
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )
        }
        return items;
    }

    render() {
//        console.log("render desktop");

        return ([
                <div id="desktop" style={{height: "100%", flex: "1 0 auto"}}>
                    <Menu mode="horizontal">
                        <MenuItem title="Файл">
                            <MenuItem title="Новый Новый" icon={config.button.cancelIcon}></MenuItem>
                            <MenuItem title="Старый 2" onClick={async () => {
                                alert("fuf")
                            }}></MenuItem>
                            <MenuItem title="Старый 3323" onClick={async () => {
                                alert("fuf")
                            }}></MenuItem>
                            <MenuSeparator/>
                            <MenuItem title="Режим администратора"
                                      icon={config.adminIcon}
                                      onClick={async () => {
                                alert("fuf")
                            }}></MenuItem>

                            <MenuSeparator/>
                            <MenuItem title="Закрыть программу" onClick={async () => {
                                alert("fuf")
                            }}></MenuItem>
                        </MenuItem>
                        <MenuItem title="Изменить"></MenuItem>
                        <MenuSeparator/>
                        <MenuItem title="Админ">
                            <MenuItem
                                title="Инспектор объектов"
                                onClick={async () => {
                                    this.openWindow(<SchemaExplorerWindow
                                        window={{height: 500, width: 400}}>

                                    </SchemaExplorerWindow>);
                                }}>
                            </MenuItem>
                            <MenuSeparator/>
                            <MenuItem
                                title="Список тестов"
                                onClick={async () => {
                                    this.openWindow(
                                        <TestsExplorerWindow
                                            window={{height: 600, width: 800}}>
                                        </TestsExplorerWindow>
                                    );
                                }}></MenuItem>
                        </MenuItem>
                        <MenuItem
                            title="Login"
                            onClick={async () => {
                                doLogin("admin","admin");
                                // this.openWindow(
                                //     <SelectColorWindow
                                //         window={{height: 600, width: 800}}>
                                //     </SelectColorWindow>
                                // );
                            }}></MenuItem>
                    </Menu>
                    <Toolbar groups={this.toolbar.groups} items={this.toolbar.items}></Toolbar>
                    {this.renderWindows()}
                </div>,
                <div style={{
                    position: "absolute",
                    zIndex: 8001,
                    bottom: 0,
                    paddingLeft: 3,
                    paddingRight: 3,
                    fontSize: 10,
                    fontFamily: config.font.family
                }}>
                    {this.renderTaskBarItems()}
                </div>
            ]
        )
    }

    async openWindow(win: React.ReactElement<any>): Promise<any> {

        return new Promise<boolean>((resolve: (result: any) => void, reject: (error: string) => void) => {
            if (win.props.window) {
                if (!win.props.window.id)
                    win.props.window.id = "rand_" + getRandomString();
                else {
                    win.props.window.id = "win_" + getSHA1hex(win.props.window.id);
                    let jqxWin: any = $("#" + win.props.window.id);
                    if (jqxWin.length > 0) {
                        jqxWin.jqxWindow("bringToFront");
                        return;
                    }
                }
                win.props.window.onClose = resolve;
                this.windows.push(React.cloneElement(win, {key: getRandomString()}));
            }
            else {
                if (win.type === Window) {
                    this.windows.push(React.cloneElement(win, {
                        onClose: resolve,
                        key: getRandomString(),
                    }))
                }
                else {
                    this.windows.push(React.cloneElement(win, {
                        window: {
                            onClose: resolve,
                            key: getRandomString(),
                            id: "rand_" + getRandomString()
                        }
                    }))
                }
            }
            this.forceUpdate();
        });
    }


    closeWindow(win: Window) {
        let winFromList = this.windows.find((w: any) => w.id === win.props.id);
        if (win) {
            this.windows.slice(this.windows.indexOf(winFromList), 1);
            this.forceUpdate();
            win.destroy();
            console.log("win.destroy");
        }
    }

    async openSchemaWindow(winId: string, props: any = {}): Promise<void> {
        await this.loadBabelScript(winId);
        let winClass = (window as any)[winId];
        if (!props.key)
            props.key = getRandomString();
        this.openWindow(new winClass().render(props));
    }

    async loadBabelScript(className: string): Promise<void> {
        if ((window as any)[className])
            return;

        let fileName = replaceAll(className, "_", "/") + ".jsx";

        let script: any;

        try {
            script = await $.get(fileName);
        }
        catch (e) {
            throwError("не найден файл '" + fileName + "'");
        }

        let compiledScript = Babel.transform(script, {presets: ['es2017', 'react']}).code;

        let shortClassName = className.split("_").pop();

        compiledScript += `;window.${className}=${shortClassName};`;

        //console.log(className, compiledScript);

        eval(compiledScript);

        if (!(window as any)[className])
            throwError("ошибка загрузки '" + fileName + "'");

    }
}
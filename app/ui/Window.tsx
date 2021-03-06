import * as  React from "react";
import {CSSProperties} from "react";
import * as PropTypes from "prop-types";
import {Component} from "./Component";
import {appState} from "../AppState";
import {omit} from "../utils/omit";
import {storageSet} from "../storage/storageSet";
import {getClientMonitorSize} from "../storage/getClientMonitorSize";
import {storageGet} from "../storage/storageGet";

declare var jqxWindow: any;

export interface IWindowProps {
    id?: string;
    storageKey?: string;
    top?: number;
    left?: number;
    height?: number;
    width?: number;
    title?: string;
    children?: any;
    icon?: string;
    isModal?: boolean;

    minHeight?: number;
    maxHeight?: number;
    minWidth?: number;
    maxWidth?: number;

    onClose?: (result: boolean) => void;
    onKeyDown?: (keyCode: number) => Promise<boolean>;
}

export class Window extends Component<IWindowProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static childContextTypes = {
        window: PropTypes.object
    };

    getChildContext(): any {
        return {
            window: this
        };
    }

    content: any;
    notificationContent: any;

    componentDidMount() {
        //console.log("didmount win " + this.$id);
        this.widget = $("#" + this.$id);
        //ReactDOM.render(<Div ref={(e)=>{this.content=e}}>{this.state.children}.......</Div>, document.getElementById(this.$contentId));
        this.updateProps(this.props);
        this.widget.focus();
    }

    // componentDidUpdate() {
    //     this.content.forceUpdate();
    // }
    movedSizedEventHandler = (event: any) => {
        if (this.props.storageKey) {
            let left = parseInt(this.widget.css("left"));
            let top = parseInt(this.widget.css("top"));
            let width = parseInt(this.widget.css("width"));
            let height = parseInt(this.widget.css("height"));


            storageSet(this.props.storageKey, ["position", getClientMonitorSize()], {
                top,
                left,
                width,
                height
            });
            //console.log("moved", this.$id, event);
        }
    };

    updateProps(props: IWindowProps) {

        console.log("wWindow.updateProps()");

        let opt: any = {
            ...omit(this.props, ["id", "children", "left", "top", "icon", "onClose", "title", "onKeyDown", "storageKey"]),
            animationType: "none",
            modalOpacity: 0.2,
            showCloseButton: false,
            keyboardNavigation: false,
            keyboardCloseKey: 0,
            zIndex: 500,
        };
        if (!opt.maxHeight) {
            opt.maxHeight = 3000;
        }
        if (!opt.maxWidth) {
            opt.maxWidth = 3000;
        }

        if (props.left || props.top) {
            opt.position = {};
            if (props.left)
                opt.position.x = props.left;
            if (props.top)
                opt.position.y = props.top;
        }

        if (this.props.storageKey) {
            let pos = storageGet(this.props.storageKey, ["position", getClientMonitorSize()]);
            if (pos) {
                opt.position = {x: pos.left, y: pos.top};
                opt.height = pos.height;
                opt.width = pos.width;

                // поиск открытых окон с такими же координатами и сдвиг вниз и вправо, если найдем
                for (let div of $("body>.jqx-window")) {
                    let left = parseInt($(div).css("left"));
                    let top = parseInt($(div).css("top"));
                    if (Math.abs(opt.position.x - left) < 30) {
                        opt.position.x = left + 30;
                    }
                    if (Math.abs(opt.position.y - top) < 30) {
                        opt.position.y = top + 30;
                    }
                }

            }
        }
        this.widget.jqxWindow(opt);
        appState.desktop.forceUpdate();

        this.widget = $("#" + this.$id);
        this.widget.on("close", () => {
            this.close();
        });


        this.widget.on("moved", this.movedSizedEventHandler);
        this.widget.on("resized", this.movedSizedEventHandler);

        if (this.props.onKeyDown) {
            this.widget.on("keydown", async (event: any) => {
                let resultOk = await this.props.onKeyDown!(event.keyCode);
                if (resultOk)
                    event.stopPropagation();
                //console.log("keypress", event.keyCode);
            });
        }

    }


    async openParentWindow(win: React.ReactElement<IWindowProps>): Promise<any> {

        this.disable();
        let result = await appState.desktop.openWindow(win);
        this.enable();
        this.bringToFront();
        return result;

    }

    disabled: boolean;
    disabledStyle: CSSProperties;

    disable(disabledStyle: CSSProperties = {}) {
        this.disabledStyle = disabledStyle;
        this.widget.jqxWindow("disable");
        this.disabled = true;
        this.forceUpdate();
    }


    enable() {
        this.widget.jqxWindow("enable");
        this.disabled = false;
        this.forceUpdate();
        appState.desktop.forceUpdate();

    }

    close(result: any = false) {
        this.movedSizedEventHandler(null);
        if (this.props.onClose)
            this.props.onClose(result);
        appState.desktop.closeWindow(this);

        //this.widget.jqxWindow("close");
        //this.widget.jqxWindow("destroy");
    }

    destroy() {
        // страный глюк, когда остаеся "ждущий" курсор от убитого оверлея, приходится убирать курсор вручную
        $("#" + this.$id + "-overlay").css("cursor", "auto");
        this.widget.jqxWindow("destroy");
        appState.desktop.forceUpdate();

    }

    bringToFront() {
        this.widget.jqxWindow("bringToFront");
        appState.desktop.forceUpdate();

    }

    focus() {
        this.widget.jqxWindow("focus");
        appState.desktop.forceUpdate();

    }



    render() {
        //console.log("render win-:" + this.props.title);
        let disabledOverlay = this.disabled ? (
            <div id={this.$id + "-overlay"} style={{
                background: "white",
                opacity: 0.4,
                position: "absolute",
                zIndex: 99,
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                ...this.disabledStyle
            }}></div>) : null;
        return (
            <div id={this.$id}>
                <div>
                     <span>
                         <img id={this.$id+"_win_icon"} src={this.props.icon} style={{verticalAlign: "middle", marginRight: 5, marginTop: -3}}/>
                         <span id={this.$id+"_win_title"} style={{fontWeight: "bold", color: "#5a5a5afc"}}>{this.props.title}</span>
                     </span>
                </div>
                <div style={{padding: 0, position: "relative"}}>
                    {this.props.children}
                </div>
                {disabledOverlay}
            </div>

        )
    }

    //
    // private _taskbarButtton: Button;
    // get taskbarButtton(): Button {
    //     if (!this._taskbarButtton) {
    //         this._taskbarButtton = new Button();
    //         this._taskbarButtton.text = this.title;
    //         this._taskbarButtton.icon = this.icon;
    //         this._taskbarButtton.onClick = (args: IEventArgs) => {
    //             this.bringToFront();
    //         };
    //     }
    //     return this._taskbarButtton;
    // }
    //
    // bringToFront() {
    //     if (this.$)
    //         this.jqxWidget("bringToFront");
    // }

}
import * as  React from "react";
import {CSSProperties} from "react";
import {storageSet} from "../storage/storageSet";
import {storageGet} from "../storage/storageGet";

export type HorzFlexPanelItemDock = "top" | "bottom" | "fill" | "left" | "right";

export interface IFlexItemProps {
    dock: HorzFlexPanelItemDock;
    height?: number;
    style?: CSSProperties;
    resizer?: "left" | "top" | "right" | "bottom";
    storageKey?: string;
}

export class FlexItem extends React.Component<IFlexItemProps> {
    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    topResizer: any;
    bottomResizer: any;
    flexItem: any;

    // todo resizer "left", "right"
    componentDidMount() {

        // if (this.props.storageKey) {
        //     let storage = storageGet(this.props.storageKey, ["size"]);
        //     if (storage && storage.height)
        //         $(this.flexItem).height(storage.height);
        // }


        if (this.topResizer) {
            let initHeight: number;
            ($(this.topResizer) as any).draggable({
                appendTo: $(this.topResizer).parents(".jqx-window").first(),
                helper: "clone",
                axis: "y",
                start: () => {
                    initHeight = $(this.flexItem).height()!;
                },
                drag: (event: any, ui: any) => {
                    $(this.flexItem).height(Math.max(10, initHeight - (ui.position.top - ui.originalPosition.top)))
                },
                stop: () => {
                    if (this.props.storageKey) {
                        storageSet(this.props.storageKey!, ["size"], {height: $(this.flexItem).height()});
                    }
                }
            });
        }
        if (this.bottomResizer) {
            let initHeight: number;
            ($(this.bottomResizer) as any).draggable({
                appendTo: $(this.bottomResizer).parents(".jqx-window").first(),
                helper: "clone",
                axis: "y",
                start: () => {
                    initHeight = $(this.flexItem).height()!;
                },
                drag: (event: any, ui: any) => {
                    $(this.flexItem).height(Math.max(10, initHeight - ( ui.originalPosition.top - ui.position.top )))
                },
                stop: () => {
                    if (this.props.storageKey) {
                        storageSet(this.props.storageKey!, ["size"], {height: $(this.flexItem).height()});
                    }
                }
            });
        }

    }

    renderTopResizer(): any {
        if (this.props.resizer === "top")
            return (
                <div
                    ref={(e) => this.topResizer = e!}
                    className="buhta-resizer"
                    style={{
                        cursor: "n-resize",
                        width: "100%",
                        height: 6,
                    }}
                >
                </div>
            );
        else
            return null;

    }

    renderBottomResizer(): any {
        if (this.props.resizer === "bottom")
            return (
                <div
                    ref={(e) => this.bottomResizer = e!}
                    className="buhta-resizer"
                    style={{
                        cursor: "s-resize",
                        width: "100%",
                        height: 6,
                    }}
                >
                </div>
            );
        else
            return null;

    }

    render() {

        let style: CSSProperties = {
            ...this.props.style,
            //border: "1px solid red",
            display: "flex",
        };

        if (this.props.storageKey) {
            let storage = storageGet(this.props.storageKey, ["size"]);
            if (storage && storage.height)
                style.height=storage.height;
            if (storage && storage.width)
                style.height=storage.width;
        }


        if (this.props.dock === "fill") {
            style.flex = "1 1 auto";
            //style.height = 100;
        }
        else {
            style.flex = "0 0 auto";
        }

        return ([
            this.renderTopResizer(),
            <div
                ref={(e) => this.flexItem = e!}
                style={style}
            >
                {this.props.children}
            </div>,
            this.renderBottomResizer(),
        ]);
        // return (
        //     <div
        //         ref={(e)=>this.flexItem=e!}
        //         style={style}
        //     >
        //         {this.renderTopResizer()}
        //         {this.props.children}
        //     </div>
        // );
    }

}
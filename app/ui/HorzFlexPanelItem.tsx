import * as  React from "react";
import {CSSProperties} from "react";

export type HorzFlexPanelItemDock = "top" | "bottom" | "fill";

export interface IHorzFlexPanelItemProps {
    dock: HorzFlexPanelItemDock;
    height?: number;
}

export class HorzFlexPanelItem extends React.Component<IHorzFlexPanelItemProps> {

    render() {

        let style: CSSProperties = {
            //border: "1px solid red",
            display: "flex",
        };

        if (this.props.dock === "fill") {
            style.flex = "1 0 auto";
            //style.height = 100;
        }
        else {
            style.flex = "0 0 auto";
        }

        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }

}
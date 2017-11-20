import * as  React from "react";
import {CSSProperties} from "react";

export type HorzFlexPanelItemDock = "top" | "bottom" | "fill" | "left" | "right";

export interface IFlexItemProps {
    dock: HorzFlexPanelItemDock;
    height?: number;
    style?: CSSProperties;
}

export class FlexItem extends React.Component<IFlexItemProps> {
    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    render() {

        let style: CSSProperties = {
            ...this.props.style,
            //border: "1px solid red",
            display: "flex",
        };

        console.log("style",this.props, this.props.style,style);

        if (this.props.dock === "fill") {
            style.flex = "1 1 auto";
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
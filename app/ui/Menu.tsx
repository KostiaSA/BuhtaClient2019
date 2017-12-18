import * as  React from "react";
import {CSSProperties} from "react";
import {isString} from "util";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";
import {getTextWidth} from "../utils/getTextWidth";
import {removeAllMenuPopups} from "../utils/removeAllMenuPopups";

export interface IMenuProps extends IComponentProps {
    mode: "horizontal" | "vertical" | "popup";
    left?: number;
    top?: number;
    height?: string | number;
    width?: string | number;
}

export class Menu extends Component<IMenuProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props);

        if (this.props.mode === "popup") {
            let intervalId = setInterval(() => {
                if (this.widget.css("display") === "none") {
                    removeAllMenuPopups();
                    clearInterval(intervalId);
                }
            }, 200);
        }
    }


    updateProps(props: IMenuProps) {
        let opt: any = {
            ...omit(this.props, ["children"]),
            animationShowDuration: 0,
            animationHideDuration: 0,
            animationShowDelay: 0,
        };

        if (this.props.mode === "popup") {
            // сначала удаляем все от предыдущего popup
            removeAllMenuPopups(this.$id);
        }

        this.widget.jqxMenu(opt);

        if (this.props.mode === "popup") {
            this.widget.jqxMenu("open", this.props.left, this.props.top);
        }

        this.widget = $("#" + this.$id);

    }

    render() {
//        console.log("render Menu", this.props.children);

        let style: CSSProperties = {};

        let clonedChildren = this.props.children;

        if (this.props.mode !== "horizontal") {


            let maxWidth = 100;
            let needEmptyIcons = false;

            React.Children.toArray(this.props.children).forEach((child: any) => {
                if (isString(child.props.title)) {
                    maxWidth = Math.max(maxWidth, getTextWidth(child.props.title.substr(0, 50)) * 1.3 + 50);
                }
                needEmptyIcons = needEmptyIcons || child.props.icon;
            });
            style.width = maxWidth;

            clonedChildren = React.Children.toArray(this.props.children).map((child: any) => {
                return React.cloneElement(child, {emptyIcon: needEmptyIcons});
            });

        }

        return (
            <div id={this.$id}>
                <ul style={style}>
                    {clonedChildren}
                </ul>
            </div>
        )
    }

}
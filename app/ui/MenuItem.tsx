import * as  React from "react";
import {CSSProperties} from "react";
import {isString} from "util";
import {getTextWidth} from "../utils/getTextWidth";
import {MenuSeparator} from "./MenuSeparator";

export interface IMenuItemProps {
    title: string | React.ReactNode;
    style?: CSSProperties
    icon?: string;
    emptyIcon?: boolean;
    onClick?: () => Promise<void>;
    width?: string | number;
    startGroup?: boolean;

}

export class MenuItem extends React.Component<IMenuItemProps> {


    intervalId: any;

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderItems(): React.ReactNode {

        let maxWidth = 100;
        let needEmptyIcons = false;
        React.Children.toArray(this.props.children).forEach((child: any) => {
            if (isString(child.props.title)) {
                maxWidth = Math.max(maxWidth, getTextWidth(child.props.title.substr(0, 50)) * 1.3 + 25);
                needEmptyIcons = needEmptyIcons || child.props.icon;
            }
        });

        let clonedChildren = React.Children.toArray(this.props.children).map((child: any) => {
            return React.cloneElement(child, {emptyIcon: needEmptyIcons});
        });


        if (this.props.children)
            return (
                <ul style={{width: maxWidth}}>
                    {clonedChildren}
                </ul>

            );
        else
            return null;
    }


    renderSeparator(): React.ReactNode {
        if (this.props.startGroup)
            return <MenuSeparator key="1"/>;
        else
            return null;
    }

    render() {
        return (
            [
                this.renderSeparator(),
                <li
                    key="2"
                    onClick={() => {
                        if (this.props.onClick) this.props.onClick()
                    }}
                >
                    {this.props.icon ? <img style={{float: "left", marginRight: 5}} src={this.props.icon}/> : null}
                    <span
                        style={{marginLeft: (this.props.emptyIcon && !this.props.icon) ? 20 : 0}}>{this.props.title}</span>
                    {this.renderItems()}
                </li>
            ]
        );
    }

}
import * as  React from "react";
import {CSSProperties} from "react";
import {isString} from "util";
import {getTextWidth} from "../utils/getTextWidth";

export interface IMenuSeparatorProps {
    style?: CSSProperties
}

export class MenuSeparator extends React.Component<IMenuSeparatorProps> {

    render() {
        return React.createElement("li", { type:"separator", style: Object.assign({}, this.props.style) });
    }

}
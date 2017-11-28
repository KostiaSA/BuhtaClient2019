import * as  React from "react";
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";


export interface IFormPanelItemProps extends IComponentProps{
    title: string | React.ReactNode;
    height?: string | number;
    bindObj?: any;
}

export class FormPanelItem extends Component<IFormPanelItemProps> {
    static childContextTypes = {
        bindObj: PropTypes.object
    };

    static contextTypes = {
        ...Component.contextTypes,
        bindObj: PropTypes.object
    };

    getChildContext() {
        return {bindObj: this.props.bindObj || this.context.bindObj};
    }

    render() {
        return <div style={{height: this.props.height}}>{this.props.children}</div>;
    }

}
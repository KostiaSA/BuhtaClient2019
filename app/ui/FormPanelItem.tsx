import * as  React from "react";
import * as PropTypes from "prop-types";


export interface IFormPanelItemProps {
    title: string | React.ReactNode;
    height?: string | number;
    bindObj?: any;
}

export class FormPanelItem extends React.Component<IFormPanelItemProps> {
    static childContextTypes = {
        bindObj: PropTypes.object
    };

    static contextTypes = {
        bindObj: PropTypes.object
    };

    getChildContext() {
        return {bindObj: this.props.bindObj || this.context.bindObj};
    }

    render() {
        return <div style={{height: this.props.height}}>{this.props.children}</div>;
    }

}
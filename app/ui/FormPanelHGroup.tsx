import * as  React from "react";
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {CheckBox} from "./inputs/CheckBox";
import {config} from "../config";


export interface IFormPanelHGroupProps extends IComponentProps {
    title?: string | React.ReactNode;
    height?: string | number;
    bindObj?: any;
}

export class FormPanelHGroup extends Component<IFormPanelHGroupProps> {
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

    // render() {
    //     return <div style={{height: this.props.height}}>{this.props.children}</div>;
    // }

    renderItems(): React.ReactNode {
        return React.Children.toArray(this.props.children).map((child, index) => {

            let title = (child as any).props.title || (child as any).props.bindProp;
            if ((child as any).type === CheckBox)
                title = "";


            let titleTd: any;
            if (index > 0) {
                titleTd = (
                    <td key={index} style={{
                        verticalAlign: "middle",
                        display: (child as any).props.hidden ? "none" : undefined
                    }}>
                        <div style={{
                            textAlign: "right",
                            paddingLeft: 8,
                            paddingRight: 4,
                            height: (child as any).props.height,
                            color: config.formPanel.labelColor,
                            whiteSpace: "nowrap",
                        }}>
                            {title}
                        </div>
                    </td>
                )
            }

            return (
                [
                    titleTd,
                    <td key={index + 1000000} style={{
                        verticalAlign: "top",
                        display: (child as any).props.hidden ? "none" : undefined
                    }}>
                        {child}
                    </td>
                ]
            )
        });
    }

    render() {
        //console.log("render FormPanel");
        return (
            <table id={this.$id} style={{border: "none"}}>
                <tbody>
                <tr>
                    {this.renderItems()}
                </tr>
                </tbody>
            </table>
        )
    }


}
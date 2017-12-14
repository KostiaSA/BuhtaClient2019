import * as  React from "react";
import * as PropTypes from "prop-types";
import * as Joi from "joi";
import {Component, IComponentProps} from "./Component";

import {reassignObject} from "../utils/reassignObject";
import {config} from "../config";
import {XJSON_clone, XJSON_equals} from "../utils/xjson";
import {CheckBox} from "./inputs/CheckBox";


export interface IFormPanelProps extends IComponentProps {
    bindObj?: any;
    validator?: Joi.ObjectSchema;
}

export class FormPanel extends Component<IFormPanelProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static childContextTypes = {
        bindObj: PropTypes.object,
        validator: PropTypes.object
    };

    static contextTypes = {
        ...Component.contextTypes,
        bindObj: PropTypes.object,
        validator: PropTypes.object
    };

    getChildContext(): any {
        return {
//            ...super.getChildContext(),
            bindObj: this.props.bindObj,
            validator: this.props.validator
        };
    }

    get bindObj(): any {
        let ret = this.props.bindObj || this.context.bindObj;
        return ret;
    }

    get validator(): any {
        let ret = this.props.validator || this.context.validator;
        return ret;
    }

    clonedBindObj: any;

    componentDidMount() {
        // console.log("didmount FormPanel " + this.$id);
        // this.widget = $("#" + this.$id);
        // //ReactDOM.render(<Div ref={(e)=>{this.content=e}}>{this.state.children}.......</Div>, document.getElementById(this.$contentId));
        // this.updateProps(this.props);
        if (this.bindObj) {
            this.clonedBindObj = XJSON_clone(this.bindObj);
        }
    }

    get needSaveChanges(): boolean {
        return !this.clonedBindObj || !XJSON_equals(this.clonedBindObj, this.bindObj);
    }

    cancelChanges() {
        if (this.bindObj && this.clonedBindObj) {
            reassignObject(this.bindObj, this.clonedBindObj);
        }
    }


    renderItems(): React.ReactNode {
        return React.Children.toArray(this.props.children).map((child, index) => {

            let title = (child as any).props.title || (child as any).props.bindProp;
            if ((child as any).type === CheckBox)
                title = "";

            return (
                <tr key={index}
                    style={{
                        display: (child as any).props.hidden ? "none" : undefined
                    }}
                >
                    <td>
                        <div style={{
                            textAlign: "right",
                            paddingRight: 8,
                            height: (child as any).props.height,
                            color: config.formPanel.labelColor
                        }}>
                            {title}
                        </div>
                    </td>
                    <td style={{paddingTop: index > 0 ? config.formPanel.inputVerticalSpace : 0}}>
                        {child}
                    </td>
                </tr>
            )
        });
    }

    render() {
        console.log("render FormPanel");
        return (
            <table id={this.$id} style={{border: "none"}}>
                <tbody>
                {this.renderItems()}
                </tbody>
            </table>
        )
    }

}
import * as  React from "react";
import * as PropTypes from "prop-types";
import * as Joi from "joi";
import {Component, IComponentProps} from "./Component";

import {reassignObject} from "../utils/reassignObject";
import {config} from "../config";
import {XJSON_clone, XJSON_equals} from "../utils/xjson";
import {CheckBox} from "./inputs/CheckBox";
import {BaseInput} from "./inputs/BaseInput";
import {FormPanelHGroup} from "./FormPanelHGroup";


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
        validator: PropTypes.object,
        formPanel: PropTypes.object,
    };

    static contextTypes = {
        ...Component.contextTypes,
        bindObj: PropTypes.object,
        validator: PropTypes.object,
        formPanel: PropTypes.object,
    };

    getChildContext(): any {
        return {
//            ...super.getChildContext(),
            bindObj: this.props.bindObj,
            validator: this.props.validator,
            formPanel: this,
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

    renderedInputs: BaseInput[] = [];
    clonedBindObj: any;

    componentDidMount() {
        if (this.bindObj) {
            this.clonedBindObj = XJSON_clone(this.bindObj);
        }
    }

    get needSaveChanges(): boolean {
        return !this.clonedBindObj || !XJSON_equals(this.clonedBindObj, this.bindObj);
    }

    resetNeedSaveChanges() {
        if (this.bindObj) {
            this.clonedBindObj = XJSON_clone(this.bindObj);
        }
        this.renderedInputs.forEach((input: BaseInput) => input.resetIsChanged());
        this.forceUpdate();
    }

    cancelChanges() {
        if (this.bindObj && this.clonedBindObj) {
            reassignObject(this.bindObj, this.clonedBindObj);
        }
    }


    renderItems(): React.ReactNode {
        return React.Children.toArray(this.props.children).map((child: any, index) => {

            let title = child.props.title || (child as any).props.bindProp;
            if (child.type === CheckBox)
                title = "";
            else if (child.type === FormPanelHGroup) {
                if (child.props.title)
                    title = child.props.title;
                else {
                    let firstPanelItem: any = React.Children.toArray(child.props.children)[0];
                    if (firstPanelItem.type === CheckBox)
                        title = "";
                    else {
                        title = firstPanelItem.props.title;
                    }
                }
            }

            return (
                <tr key={index}
                    style={{
                        display: (child as any).props.hidden ? "none" : undefined
                    }}
                >
                    <td style={{verticalAlign: "middle"}}>
                        <div style={{
                            textAlign: "right",
                            paddingRight: 5,
                            height: (child as any).props.height,
                            color: config.formPanel.labelColor,
                            whiteSpace: "nowrap",
                            marginTop: index > 0 ? config.formPanel.inputVerticalSpace : 0,
                        }}>
                            {title}
                        </div>
                    </td>
                    <td style={{paddingLeft:0, paddingTop: index > 0 ? config.formPanel.inputVerticalSpace : 0, verticalAlign: "top"}}>
                        {child}
                    </td>
                </tr>
            )
        });
    }

    render() {
        //console.log("render FormPanel");
        return (
            <table id={this.$id} style={{border: "none", width: "100%"}}>
                <tbody>
                <tr>
                    <th style={{width: "1%"}}></th>
                    <th style={{width: "99%"}}></th>
                </tr>
                {this.renderItems()}
                </tbody>
            </table>
        )
    }

}
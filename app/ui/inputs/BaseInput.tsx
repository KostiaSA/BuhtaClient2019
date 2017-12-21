import * as  React from "react";
import * as PropTypes from "prop-types";
import * as Joi from "joi";
import {ValidationError} from "joi";
import {Component, IComponentProps} from "../Component";
import {objectPathGet} from "../../utils/objectPathGet";

import {config} from "../../config";
import {joiValidate} from "../../validation/joiValidate";
import {XJSON_stringify} from "../../utils/xjson";
import {FormPanel} from "../FormPanel";
import {throwError} from "../../utils/throwError";


export interface IBaseInputProps extends IComponentProps {
    title?: string | React.ReactNode;
    bindObj?: any;
    bindProp: string;
    onChange?: () => Promise<void>;
    hidden?: boolean;
    validator?: Joi.ObjectSchema;
    storageKey?: string;
    resizable?: boolean;
    readOnly?: boolean;
}

export class BaseInput<P extends IBaseInputProps=IBaseInputProps> extends Component<P> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static contextTypes = {
        ...Component.contextTypes,
        bindObj: PropTypes.object,
        validator: PropTypes.object,
        formPanel: PropTypes.object,
    };

    get bindObj(): any {
        return this.props.bindObj || this.context.bindObj;
    }

    get formPanel(): FormPanel {
        return this.context.formPanel;
    }

    get validator(): Joi.ObjectSchema {
        return this.props.validator || this.context.validator;
    }

    get isChanged(): boolean {
        if (!this.initialValue)
            return false;
        else
            return XJSON_stringify(this.initialValue) !== XJSON_stringify(objectPathGet(this.bindObj, this.props.bindProp));
    }

    resetIsChanged() {
        if (this.bindObj && this.props.bindProp)
            this.initialValue = objectPathGet(this.bindObj, this.props.bindProp);
    }

    initialValue: any;

    validationError: ValidationError | null;

    validate() {
        if (this.validator) {
            this.validationError = joiValidate(this.bindObj, this.validator);
        }
        else
            this.validationError = null;
    }

    renderValidationResult(): React.ReactNode {

        if (!this.validationError) {
            return null;
        }
        else {
            let errDetail = this.validationError.details.find((detail: any) => detail.path.join(".") === this.props.bindProp);
            if (!errDetail)
                return null;
            let errDetailMessage = (errDetail!.message.split(":")[1] || errDetail!.message).trim();
            return (
                <div
                    key={2}
                    title={errDetailMessage}
                    style={{
                        color: config.formPanel.errorMessageColor,
                        fontSize: config.formPanel.errorMessageFontSize,
                        fontStyle: config.formPanel.errorMessageFontStyle,
                        marginLeft: 3
                    }}>
                    {" " + errDetailMessage.substr(0, config.formPanel.errorMessageMaxLength)}
                </div>
            )
        }
    }

    renderRightResizerTd(): React.ReactNode {
        if (!this.props.resizable)
            return null;
        else
            return (
                <td style={{padding: 0, verticalAlign: "middle", borderLeft: "1px solid rgba(192, 192, 192, 0.6)"}}>
                    <div
                        className="resizer"
                        style={{
                            cursor: "e-resize",
                            width: 10,
                            height: "100%",
                            color: "transparent"
                        }}
                    >
                        .
                    </div>
                </td>
            )
    }


    render(): React.ReactNode {
        throwError( "BaseInput:abstract error");
        throw "fake";
    }

}
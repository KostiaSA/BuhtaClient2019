import * as  React from "react";
import * as PropTypes from "prop-types";
import * as Joi from "joi";
import {ValidationResult} from "joi";
import {Component, IComponentProps} from "../Component";
import {objectPathGet} from "../../utils/objectPathGet";
import {stringify} from "ejson";
import {config} from "../../const/config";


export interface IBaseInputProps extends IComponentProps {
    title?: string | React.ReactNode;
    bindObj?: any;
    bindProp: string;
    onChange?: () => Promise<void>;
    hidden?: boolean;
    validator?: Joi.ObjectSchema;
}

export class BaseInput<P extends IBaseInputProps> extends Component<P> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static contextTypes = {
        ...Component.contextTypes,
        bindObj: PropTypes.object,
        validator: PropTypes.object,
    };

    get bindObj(): any {
        return this.props.bindObj || this.context.bindObj;
    }

    get validator(): Joi.ObjectSchema {
        return this.props.validator || this.context.validator;
    }

    get isChanged(): boolean {
        if (!this.initialValue)
            return false;
        else
            return stringify(this.initialValue) !== stringify(objectPathGet(this.bindObj, this.props.bindProp));
    }

    initialValue: any;

    validationResult: ValidationResult<any>;

    validate() {
        if (this.validator) {
            this.validationResult = Joi.validate(this.bindObj, this.validator, {
                abortEarly: false,
                allowUnknown: false
            });
        }
        else
            delete this.validationResult;
    }

    renderValidationResult(): React.ReactNode {

        if (!this.validationResult || !this.validationResult.error) {
            return null;
        }
        else {
            let errDetail = this.validationResult.error.details.find((detail: any) => detail.path.join(".") === this.props.bindProp && detail.type !== "object.allowUnknown");
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

    render(): React.ReactNode {
        throw "BaseInput:abstract error";
    }

}
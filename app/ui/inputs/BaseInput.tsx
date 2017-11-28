import * as  React from "react";
import * as PropTypes from "prop-types";
import * as Joi from "joi";
import {ValidationResult} from "joi";
import {Component, IComponentProps} from "../Component";
import {objectPathGet} from "../../utils/objectPathGet";
import {stringify} from "ejson";


export interface IBaseInputProps extends IComponentProps {
    title?: string | React.ReactNode;
    // height?: string | number;
    // width?: string | number;
    // placeHolder?: string;
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

    // componentDidMount() {
    //     this.widget = $("#" + this.$id);
    //     this.updateProps(this.props, true);
    //     this.initialValue = objectPathGet(this.props.bindObj || this.context.bindObj, this.props.bindProp);
    //     this.widget.jqxInput("val", this.initialValue);
    //     this.widget.on("change",
    //         (event: any) => {
    //             objectPathSet(this.props.bindObj || this.context.bindObj, this.props.bindProp, this.widget.val());
    //             this.forceUpdate();
    //             console.log("change");
    //         });
    // }

    // updateProps(props: IInputProps, create: boolean) {
    //     let opt: any = omit(props, ["bindObj", "bindProp", "title", "children"]);
    //
    //     opt.height = opt.height || 24;
    //     opt.width = opt.width || 200;
    //
    //     this.widget.jqxInput(opt);
    // }


    render(): React.ReactNode {
        throw "BaseInput:abstract error";
    }

}
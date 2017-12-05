import * as  React from "react";
import {CSSProperties} from "react";
import {omit} from "../../utils/omit";
import {objectPathGet} from "../../utils/objectPathGet";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";
import {config} from "../../const/config";

export interface INumberInputProps extends IBaseInputProps {
    height?: string | number;
    width?: string | number;
    decimalDigits?: number;
    decimalSeparator?: string;
    digits?: number;
    groupSeparator?: string;
    spinButtons?: boolean;
    symbol?: string;
}

export class NumberInput extends BaseInput<INumberInputProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);
        this.initialValue = objectPathGet(this.bindObj, this.props.bindProp);

        if (this.initialValue)
            this.widget.jqxNumberInput("val", this.initialValue);

        this.widget.on("change",
            async (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                if (this.props.onChange) {
                    await this.props.onChange();
                }
                this.validate();
                this.forceUpdate();
            });

        this.widget.on("valueChanged",
            async (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                this.validate();
                this.forceUpdate();
            });

        this.widget.find("input").css("color", this.widget.css("color"));
        this.widget.find("input").css("background", this.widget.css("background"));

    }

    componentDidUpdate() {
        this.widget.find("input").css("color", this.widget.css("color"));
        this.widget.find("input").css("background", this.widget.css("background"));
    }

    updateProps(props: INumberInputProps, create: boolean) {
        let opt: any = omit(props, ["bindObj", "bindProp", "title", "children", "onChange", "hidden", "validator","storageKey","resizable"]);

        opt.height = opt.height || config.baseInput.height;
        opt.width = opt.width || config.numberInput.width;

        opt.digits = opt.digits || config.numberInput.digits;
        opt.decimalSeparator = opt.decimalSeparator || config.numberInput.decimalSeparator;
        opt.groupSeparator = opt.groupSeparator || config.numberInput.groupSeparator;

        if (opt.spinButtons !== true)
            opt.spinButtons = false;

        opt.promptChar = " ";
        opt.symbolPosition = "right";
        opt.max = Number.MAX_SAFE_INTEGER;
        opt.min = Number.MIN_SAFE_INTEGER;


        this.widget.jqxNumberInput(opt);
        this.widget = $("#" + this.$id);

    }

    render() {
        console.log("render Input");
        let renderedValidationResult = this.renderValidationResult();

        let style: CSSProperties = {};

        if (this.isChanged)
            style.color = config.formPanel.inputChangedColor;

        if (this.widget && this.widget.val() < 0)
            style.color = config.numberInput.negativeColor;


        if (renderedValidationResult)
            style.background = config.formPanel.errorInputBackground;

        return (
            [<div key={1} id={this.$id} style={style}/>, renderedValidationResult]
        )
    }

}
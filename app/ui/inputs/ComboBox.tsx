import * as  React from "react";
import * as Joi from "joi";
import {CSSProperties} from "react";
import {omit} from "../../utils/omit";
import {objectPathGet} from "../../utils/objectPathGet";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";


export interface IComboBoxProps extends IBaseInputProps {
    height?: string | number;
    width?: string | number;
    placeHolder?: string;
    displayMember?: string;
    valueMember?: string;
    source?: any;
}

export class ComboBox extends BaseInput<IComboBoxProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);
        this.initialValue = objectPathGet(this.bindObj, this.props.bindProp);
        if (this.initialValue)
            this.widget.jqxComboBox("val", this.initialValue);
        this.widget.on("change",
            async (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                if (this.props.onChange) {
                    await this.props.onChange();
                }
                if (this.validator) {
                    this.validationResult = Joi.validate(this.bindObj, this.validator, {abortEarly: false});
                    //console.log("this.validationResult", this.validationResult)
                }
                this.forceUpdate();
                console.log("change");
            });
        this.widget.find("input").css("color", this.widget.css("color"));
    }

    componentDidUpdate() {
        this.widget.find("input").css("color", this.widget.css("color"));
    }

    updateProps(props: IComboBoxProps, create: boolean) {
        let opt: any = omit(props, ["bindObj", "bindProp", "title", "children", "onChange", "hidden", "validator"]);

        opt.animationType = "none";
        opt.autoDropDownHeight = true;
        opt.height = opt.height || 24;
        opt.width = opt.width || 200;

        this.widget.jqxComboBox(opt);

    }


    render(): React.ReactNode {
        console.log("render Combobox");

        let style: CSSProperties = {};
        if (this.isChanged)
            style.color = "#2196F3";

        return (
            <div id={this.$id} style={style}/>
        )
    }

}
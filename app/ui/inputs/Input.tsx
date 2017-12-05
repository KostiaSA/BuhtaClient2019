import * as  React from "react";
import {CSSProperties} from "react";

import {omit} from "../../utils/omit";
import {objectPathGet} from "../../utils/objectPathGet";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";
import {config} from "../../const/config";

export interface IInputProps extends IBaseInputProps {
    height?: string | number;
    width?: string | number;
    placeHolder?: string;
}

export class Input extends BaseInput<IInputProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);
        this.initialValue = objectPathGet(this.bindObj, this.props.bindProp);
        if (this.initialValue)
            this.widget.jqxInput("val", this.initialValue);

        this.widget.on("change",
            async (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                if (this.props.onChange) {
                    await this.props.onChange();
                }
                this.validate();
                this.forceUpdate();
            });

        this.widget.on("keyup",
            async (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                this.validate();
                this.forceUpdate();
            });
    }

    updateProps(props: IInputProps, create: boolean) {
        let opt: any = omit(props, ["bindObj", "bindProp", "title", "children", "onChange", "hidden", "validator","storageKey","resizable"]);

        opt.height = opt.height || config.baseInput.height;
        opt.width = opt.width || config.baseInput.width;

        this.widget.jqxInput(opt);
        this.widget = $("#" + this.$id);

    }

    render() {
        console.log("render Input");
        let renderedValidationResult = this.renderValidationResult();

        let style: CSSProperties = {};
        if (this.isChanged)
            style.color = config.formPanel.inputChangedColor;
        if (renderedValidationResult)
            style.background = config.formPanel.errorInputBackground;

        return (
            [<input key={1} id={this.$id} style={style} type="text"/>, renderedValidationResult]
        )
    }

}
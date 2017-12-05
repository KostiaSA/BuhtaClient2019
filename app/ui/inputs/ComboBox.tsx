import * as  React from "react";
import {CSSProperties} from "react";
import {omit} from "../../utils/omit";
import {isFunction} from "util";
import {objectPathGet} from "../../utils/objectPathGet";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";
import {config} from "../../const/config";

//const Resizable = require("re-resizable").default;

export interface IComboBoxProps extends IBaseInputProps {
    height?: string | number;
    width?: string | number;
    placeHolder?: string;
    displayMember?: string;
    valueMember?: string;
    source?: any[] | (() => Promise<any[]>);
    searchMode?: "none" | "contains" | "containsignorecase" | "equals" | "equalsignorecase" | "startswithignorecase" | "startswith" | "endswithignorecase" | "endswith";
    itemHeight?: number;
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
                this.validate();
                this.forceUpdate();
                console.log("combobox change");
            });
        this.widget.find("input").css("color", this.widget.css("color"));
        this.widget.find("input").css("background", this.widget.css("background"));

        // resize?
    }

    componentDidUpdate() {
        this.widget.find("input").css("color", this.widget.css("color"));
        this.widget.find("input").css("background", this.widget.css("background"));
    }

    async updateProps(props: IComboBoxProps, create: boolean) {
        let opt: any = omit(props, ["bindObj", "bindProp", "title", "children", "onChange", "hidden", "validator", "source"]);

        opt.animationType = "none";
        opt.autoDropDownHeight = true;
        opt.height = opt.height || config.baseInput.height;
        opt.width = opt.width || config.baseInput.width;

        opt.searchMode = opt.searchMode || "containsignorecase";
        opt.itemHeight = opt.itemHeight || config.comboBox.itemHeight;

        this.widget.jqxComboBox(opt);
        this.widget = $("#" + this.$id);

        if (isFunction(this.props.source)) {
            this.widget.jqxComboBox({source: await (this.props.source as any)()});
            if (this.initialValue)
                this.widget.jqxComboBox("val", this.initialValue);

        }
        else
            this.widget.jqxComboBox({source: this.props.source});


    }


    render(): React.ReactNode {
        console.log("render Combobox");
        let renderedValidationResult = this.renderValidationResult();

        let style: CSSProperties = {};

        if (this.isChanged)
            style.color = config.formPanel.inputChangedColor;

        if (renderedValidationResult)
            style.background = config.formPanel.errorInputBackground;

        return (
            [<div key={1} id={this.$id} style={style}/>, renderedValidationResult]
        )

    }

}
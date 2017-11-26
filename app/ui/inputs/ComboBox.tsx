import * as  React from "react";
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
        this.widget.jqxComboBox("val", this.initialValue);
        this.widget.on("change",
            (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                this.forceUpdate();
                console.log("change");
            });
    }

    updateProps(props: IComboBoxProps, create: boolean) {
        let opt: any = omit(props, ["bindObj", "bindProp", "title", "children"]);

        opt.animationType = "none";
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
import * as  React from "react";
import {CSSProperties} from "react";
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "../Component";
import {omit} from "../../utils/omit";
import {objectPathGet} from "../../utils/objectPathGet";
import {stringify} from "ejson";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";


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
        this.initialValue = objectPathGet(this.props.bindObj || this.context.bindObj, this.props.bindProp);
        this.widget.jqxInput("val", this.initialValue);
        this.widget.on("change",
            (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                this.forceUpdate();
                console.log("change");
            });
    }

    updateProps(props: IInputProps, create: boolean) {
        let opt: any = omit(props, ["bindObj", "bindProp", "title", "children"]);

        opt.height = opt.height || 24;
        opt.width = opt.width || 200;

        this.widget.jqxInput(opt);
    }


    render() {
        console.log("render Input");

        let style: CSSProperties = {};
        if (this.isChanged)
            style.color = "#2196F3";

        return (
            <input id={this.$id} style={style} type="text"/>
        )
    }

}
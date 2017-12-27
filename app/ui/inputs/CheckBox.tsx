import * as  React from "react";
import {CSSProperties} from "react";

import {omit} from "../../utils/omit";
import {objectPathGet} from "../../utils/objectPathGet";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";
import {config} from "../../config";
import {storageGet} from "../../storage/storageGet";
import {storageSet} from "../../storage/storageSet";

export interface ICheckBoxProps extends IBaseInputProps {
    height?: string | number;
    width?: string | number;
}

export class CheckBox extends BaseInput<ICheckBoxProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        if (this.formPanel)
            this.formPanel.renderedInputs.push(this);
        this.widget = $("#" + this.$id);


        this.updateProps(this.props, true);
        this.initialValue = objectPathGet(this.bindObj, this.props.bindProp);
        if (this.initialValue)
            this.widget.jqxCheckBox("val", this.initialValue);

        this.widget.on("change",
            async (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                if (this.props.onChange) {
                    await this.props.onChange();
                }
                this.validate();
                this.forceUpdate();
            });

        this.widget.on("focus",
            async (event: any) => {
                console.log("checkbox----------focus-----");
            });

        this.widget.on("keyup",
            async (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                this.validate();
                this.forceUpdate();
            });

        if (this.props.resizable) {

            let resizer = this.widget.parents("table").first().find(".resizer");

            let initWidth: number;
            resizer.draggable({
                appendTo: "body",
                helper: "clone",
                axis: "x",
                start: () => {
                    initWidth = this.widget.jqxCheckBox("width");
                },
                drag: (event: any, ui: any) => {
                    this.widget.jqxCheckBox({width: Math.max(50, initWidth + ui.position.left - ui.originalPosition.left)})
                },
                stop: () => {
                    if (this.props.storageKey) {
                        storageSet(this.props.storageKey!, ["size", this.getWindow().props.storageKey!], {width: this.widget.jqxCheckBox("width")});
                    }
                }
            });
        }

    }

    updateProps(props: ICheckBoxProps, create: boolean) {
        let opt: any = omit(props, ["bindObj", "bindProp", "title", "children", "onChange", "hidden", "validator", "storageKey", "resizable"]);

        opt.height = opt.height || config.baseInput.height;
        opt.width = opt.width || config.baseInput.width;

        if (this.props.storageKey) {
            let storage = storageGet(this.props.storageKey, ["size", this.getWindow().props.storageKey!]);
            if (storage && storage.width)
                opt.width = storage.width;
        }


        this.widget.jqxCheckBox(opt);
        this.widget = $("#" + this.$id);

    }

    render() {
        //console.log("render CheckBox");
        let renderedValidationResult = this.renderValidationResult();

        let style: CSSProperties = {};
        if (this.isChanged)
            style.color = config.formPanel.inputChangedColor;
        else
            style.color = config.formPanel.labelColor;
        if (renderedValidationResult)
            style.background = config.formPanel.errorInputBackground;

        return (
            [
                <table key={1} style={{borderCollapse: "collapse", borderSpacing: 0}}>
                    <tbody>
                    <tr>
                        <td style={{padding: 0}}>
                            <div id={this.$id} style={style}><span>{this.props.title}</span></div>
                        </td>
                        {this.renderRightResizerTd()}
                    </tr>
                    </tbody>
                </table>,
                renderedValidationResult
            ]
        )
    }

}
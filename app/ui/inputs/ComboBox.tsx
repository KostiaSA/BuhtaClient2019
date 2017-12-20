import * as  React from "react";
import {CSSProperties} from "react";
import {omit} from "../../utils/omit";
import {isFunction} from "util";
import {objectPathGet} from "../../utils/objectPathGet";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";
import {config} from "../../config";
import {storageSet} from "../../storage/storageSet";
import {storageGet} from "../../storage/storageGet";

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
        if (this.formPanel)
            this.formPanel.renderedInputs.push(this);
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

        if (this.props.resizable) {
            let resizer = this.widget.parents("table").first().find(".resizer");

            let initWidth: number;
            resizer.draggable({
                appendTo: "body",
                helper: "clone",
                axis: "x",
                start: () => {
                    initWidth = this.widget.jqxComboBox("width");
                },
                drag: (event: any, ui: any) => {
                    this.widget.jqxComboBox({width: Math.max(70, initWidth + ui.position.left - ui.originalPosition.left)})
                },
                stop: () => {
                    if (this.props.storageKey) {
                        storageSet(this.props.storageKey!, ["size", this.getWindow().props.storageKey!], {width: this.widget.jqxComboBox("width")});
                    }
                }
            });
        }
    }

    componentDidUpdate() {
        this.widget.find("input").css("color", this.widget.css("color"));
        this.widget.find("input").css("background", this.widget.css("background"));
    }

    async updateProps(props: IComboBoxProps, create: boolean) {
        let opt: any = omit(props, [
            "bindObj", "bindProp", "title", "children",
            "onChange", "hidden", "validator", "source",
            "storageKey", "resizable"
        ]);

        opt.animationType = "none";
        opt.autoDropDownHeight = true;


        opt.height = opt.height || config.baseInput.height;
        opt.width = opt.width || config.baseInput.width;

        if (this.props.storageKey) {
            let storage = storageGet(this.props.storageKey, ["size", this.getWindow().props.storageKey!]);
            if (storage && storage.width)
                opt.width = storage.width;
        }


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
        //console.log("render Combobox");
        let renderedValidationResult = this.renderValidationResult();

        let style: CSSProperties = {};

        if (this.isChanged)
            style.color = config.formPanel.inputChangedColor;

        if (renderedValidationResult)
            style.background = config.formPanel.errorInputBackground;

        return (
            [
                <table key={1} style={{borderCollapse: "collapse", borderSpacing: 0}}>
                    <tbody>
                    <tr>
                        <td style={{padding: 0}}>
                            <div key={1} id={this.$id} style={style}/>
                        </td>
                        <td style={{padding: 0}}>
                            <div
                                className="resizer"
                                style={{
                                    cursor: "e-resize",
                                    borderLeft: "1px solid #c0c0c0e6",
                                    width: 10,
                                    height: this.props.height || config.baseInput.height,
                                    display: this.props.resizable ? "block" : "none"
                                }}
                            >
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>,
                renderedValidationResult
            ]
        )

        // return (
        //     [<div key={1} id={this.$id} style={style}/>, renderedValidationResult]
        // )

    }

}
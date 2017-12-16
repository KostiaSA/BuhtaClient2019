import * as  React from "react";
import {CSSProperties} from "react";
import {omit} from "../../utils/omit";
import {objectPathGet} from "../../utils/objectPathGet";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";
import {config} from "../../config";
import {storageGet} from "../../storage/storageGet";
import {storageSet} from "../../storage/storageSet";
import {EditorConfiguration, EditorFromTextArea} from "codemirror";
const CodeMirror = require("codemirror");


export interface ICodeMirrorProps extends IBaseInputProps {
    height?: string | number;
    width?: string | number;
    options?: EditorConfiguration;

}

export class CodeEditor extends BaseInput<ICodeMirrorProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    editor: EditorFromTextArea;
    textArea: HTMLElement;

    componentDidMount() {
        //this.widget = $("#" + this.$id);
        console.log("CodeMirror did mount $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$" );
        this.editor = CodeMirror.fromTextArea(this.textArea, this.props.options);
        this.editor.on("change", async (event: any) => {

            objectPathSet(this.bindObj, this.props.bindProp, this.editor.getValue());
            if (this.props.onChange) {
                await this.props.onChange();
            }
            this.validate();
            this.forceUpdate();
        });


        this.updateProps(this.props, true);
        this.initialValue = objectPathGet(this.bindObj, this.props.bindProp);
        //if (this.initialValue)
          //  this.widget.jqxCodeMirror("val", this.initialValue);

        // this.widget.on("change",
        //     async (event: any) => {
        //         objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
        //         if (this.props.onChange) {
        //             await this.props.onChange();
        //         }
        //         this.validate();
        //         this.forceUpdate();
        //     });

        // this.widget.on("keyup",
        //     async (event: any) => {
        //         objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
        //         this.validate();
        //         this.forceUpdate();
        //     });

        if (this.props.resizable) {

            let resizer = this.widget.parents("table").first().find(".resizer");

            let initWidth: number;
            resizer.draggable({
                appendTo: "body",
                helper: "clone",
                axis: "x",
                start: () => {
                    initWidth = this.widget.jqxCodeMirror("width");
                },
                drag: (event: any, ui: any) => {
                    this.widget.jqxCodeMirror({width: Math.max(50, initWidth + ui.position.left - ui.originalPosition.left)})
                },
                stop: () => {
                    if (this.props.storageKey) {
                        storageSet(this.props.storageKey!, ["size", this.getWindow().props.storageKey!], {width: this.widget.jqxCodeMirror("width")});
                    }
                }
            });
        }

    }

    updateProps(props: ICodeMirrorProps, create: boolean) {
        // let opt: any = omit(props, ["bindObj", "bindProp", "title", "children", "onChange", "hidden", "validator", "storageKey", "resizable"]);
        //
        // opt.height = opt.height || config.baseInput.height;
        // opt.width = opt.width || config.baseInput.width;
        //
        // if (this.props.storageKey) {
        //     let storage = storageGet(this.props.storageKey, ["size", this.getWindow().props.storageKey!]);
        //     if (storage && storage.width)
        //         opt.width = storage.width;
        // }
        //
        //
        // this.widget.jqxCodeMirror(opt);
        // this.widget = $("#" + this.$id);

    }

    render() {
        console.log("render CodeMirror");
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
                            <textarea
                                ref={(e) => {
                                    this.textArea = e!
                                }}
                                style={{...style, height: "100%"}}
                                value={objectPathGet(this.bindObj, this.props.bindProp)}
                                readOnly={this.props.readOnly}
                            />
                        </td>
                        <td style={{padding: 0}}>
                            <div
                                className="resizer"
                                style={{
                                    cursor: "e-resize",
                                    borderLeft: "1px solid rgba(192, 192, 192, 0.20)",
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
    }

}
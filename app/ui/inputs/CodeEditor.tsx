import * as  React from "react";
import {objectPathGet} from "../../utils/objectPathGet";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";
import {EditorConfiguration, EditorFromTextArea} from "codemirror";
import {config} from "../../config";
import {storageGet} from "../../storage/storageGet";
import {storageSet} from "../../storage/storageSet";

const CodeMirror = require("codemirror");


export interface ICodeMirrorProps extends IBaseInputProps {
    height?: string | number;
    width?: string | number;
    options?: EditorConfiguration;
    resizeOnlyHeight?: boolean;
    resizeOnlyWidth?: boolean;
}

export class CodeEditor extends BaseInput<ICodeMirrorProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    editor: EditorFromTextArea;
    textArea: HTMLElement;

    componentDidMount() {
        if (this.formPanel)
            this.formPanel.renderedInputs.push(this);
        this.widget = $("#" + this.$id);
        this.editor = CodeMirror.fromTextArea(this.textArea, {autoRefresh: true, ...this.props.options});
        //console.log("=====================================",{autoRefresh: true, ...this.props.options});
        let $e = $((this.editor as any).display.wrapper);
        this.editor.setSize("100%", "100%");
        //this.editor.setOption("mode", "sql");
        $e.css("position", "absolute");
        $e.css("border", config.border);

        if (this.props.resizable && this.props.storageKey) {
            let storage = storageGet(this.props.storageKey, ["size", this.getWindow().props.storageKey!]);
            if (storage && storage.width && !this.props.resizeOnlyHeight)
                this.widget.css("width", storage.width);
            if (storage && storage.height && !this.props.resizeOnlyWidth)
                this.widget.css("height", storage.height);
        }

        let lastHeight: any;
        let lastWidth: any;
        let resizeIntervalId = setInterval(() => {
            let widget = $("#" + this.$id);
            if (widget.length !== 1) {
                clearInterval(resizeIntervalId);
                return;
            }
            let h = widget.height();
            let w = widget.width();

            // h!==100 || w!==100 этот размер, почему-то имеет невидимый wiget (на скрытых закладках TabPanel)
            // чтобы не было излишей анимации при открытии TabPanel, исключаем resize
            if ((h !== 100 || w !== 100) && (h !== lastHeight || w !== lastWidth)) {
                lastWidth = w;
                lastHeight = h;
                this.editor.refresh();
            }
        }, 200);


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
        if (this.props.resizable) {

            let handles = "e, s, se";
            if (this.props.resizeOnlyHeight)
                handles = "s";
            if (this.props.resizeOnlyWidth)
                handles = "e";
            this.widget.resizable({
                minHeight: 60,
                minWidth: 100,
                handles: handles,
                stop: () => {
                    if (this.props.storageKey) {
                        storageSet(this.props.storageKey!, ["size", this.getWindow().props.storageKey!], {
                            width: this.widget.width(),
                            height: this.widget.height()
                        });
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
        //console.log("render CodeMirror");
        let renderedValidationResult = this.renderValidationResult();

        return (
            [
                <div id={this.$id}
                     key={1}
                     style={{
                         position: "relative",
                         width: this.props.width || "100%",
                         height: this.props.height || "100%",
                         border: "0px solid red",
                     }}
                >
                    <textarea
                        ref={(e) => {
                            this.textArea = e!
                        }}
                        defaultValue={objectPathGet(this.bindObj, this.props.bindProp)}
                        readOnly={this.props.readOnly}
                    />
                </div>

                ,
                renderedValidationResult
            ]
        )
    }

}
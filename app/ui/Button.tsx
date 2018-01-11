import * as  React from "react";
import {CSSProperties} from "react";
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";
import {isStringOrNullOrEmpty} from "../utils/isStringOrNullOrEmpty";
import {throwWarning} from "../utils/throwWarning";
import {showError} from "./modals/showError";


export interface IButtonProps extends IComponentProps {
    text?: string;
    height?: string | number;
    width?: string | number;
    tooltip?: string;
    tabIndex?: number;
    imgSrc?: string;
    imgPosition?: "left" | "top" | "center" | "bottom" | "right" | "topLeft" | "bottomLeft" | "topRight" | "bottomRight";
    textImageRelation?: "imageBeforeText" | "imageAboveText" | "textAboveImage" | "textBeforeImage" | "overlay";
    style?: CSSProperties;
    onClick?: () => Promise<void>;
}

export class Button extends Component<IButtonProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    // пример наследования
    static contextTypes: any = {
        ...Component.contextTypes,
        windowTest: PropTypes.object
    };

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props);
    }

    updateProps(props: IButtonProps) {
        let opt: any = omit(this.props, ["children", "text", "style", "onClick", "tabIndex", "autoFocus", "tooltip"]);

        opt.imgPosition = opt.imgPosition || "left";
        opt.textImageRelation = opt.textImageRelation || "imageBeforeText";
        if (isStringOrNullOrEmpty(this.props.text) && this.props.imgSrc) {
            opt.textImageRelation = "overlay";
            opt.width = opt.width = 28;
        }

        opt.value = this.props.text;
        if (isStringOrNullOrEmpty(opt.value) && !this.props.imgSrc) {
            opt.value = "Кнопка";
            throwWarning("Кнопка без текста и иконки.")
        }


        opt.height = this.props.height || (this.props.style ? this.props.style.height : null) || 28;

        this.widget.jqxButton(opt);
        this.widget = $("#" + this.$id);

        if (this.props.onClick)
            this.widget.on("click", async () => {
                if (!this.disabled()) {
                    let win = this.getWindow();
                    if (win) {
                        win.disable({cursor: "wait"});
                        try {
                            await this.props.onClick!();
                        }
                        catch (e) {
                            showError(e);
                        }
                        finally {
                            win.enable();
                        }
                    }
                    else
                        this.props.onClick!();
                }
            });
        else
            this.widget.off("click");
    }

    disabled(): boolean {
        return this.widget.jqxButton("disabled");
    }

    disable() {
        this.widget.jqxButton({disabled: true});
        this.forceUpdate();
    }

    enable() {
        this.widget.jqxButton({disabled: false});
        this.forceUpdate();
    }

    render() {
        //console.log("render Button");
        return (
            <input
                id={this.$id}
                type="button"
                title={this.props.tooltip}
                tabIndex={this.props.tabIndex}
                style={{display: "inline-block", ...this.props.style,}}>
                {this.props.children}
            </input>
        )
    }

}
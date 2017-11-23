import * as  React from "react";
import {CSSProperties} from "react";
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";


export interface IButtonProps extends IComponentProps {
    text?: string;
    height?: string | number;
    width?: string | number;
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
        let opt: any = omit(this.props, ["children", "text", "style", "onClick"]);

        opt.imgPosition = opt.imgPosition || "left";
        opt.textImageRelation = opt.textImageRelation || "imageBeforeText";

        opt.value = this.props.text || "Кнопка";

        //debugger
        opt.height = this.props.height || (this.props.style ? this.props.style.height : null) || 28;
        // opt.width = opt.width || "100%";


        this.widget.jqxButton(opt);
        this.widget = $("#" + this.$id);

        if (this.props.onClick)
            this.widget.on("click", async () => {
                console.log("getWindow", this.getWindow());
                if (!this.disabled()) {
                    let win = this.getWindow();
                    if (win) {
                        win.disable({cursor: "wait"});
                        await this.props.onClick!();
                        win.enable();
                        win.bringToFront();
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


    renderHeaders(): React.ReactNode {
        return React.Children.toArray(this.props.children).map((child, index) => {
            return <li key={index}>{(child as any).props.title}</li>
        });
    }

    render() {
        console.log("render Button");
        return (
            <input id={this.$id} type="button" style={{display: "inline-block", ...this.props.style,}}>
                {this.props.children}
            </input>
        )
    }

}
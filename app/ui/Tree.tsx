import * as  React from "react";
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";


export interface ITreeProps extends IComponentProps {
    height?: string | number;
    width?: string | number;
    source?: any;
    onItemClick?: (rowIndex: number) => void;
}

export class Tree extends Component<ITreeProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static contextTypes = {
        ...Component.contextTypes,
        bindObj: PropTypes.object
    };

     lastParentH: number;
     resizeIntervalId: any;

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);

        if (!this.props.height || this.props.height === "100%") {
            this.resizeIntervalId = setInterval(() => {
                let newH = this.widget.parent().innerHeight();

                // отановка таймера resize, если Tree удалена
                if ($("#" + this.$id).length !== 1) {
                    clearInterval(this.resizeIntervalId);
                }

                if (newH > 10 && this.lastParentH !== newH) {
                    //console.log("resize",this.$id,this.lastParentH,newH);
                    this.lastParentH = newH;
                    this.widget.jqxTree({height: newH});
                }
            }, 300);
        }
    }

    updateProps(props: ITreeProps, create: boolean) {
        let treeOptions: any = omit(props, ["children", "onItemClick"]);
        treeOptions.height = treeOptions.height || 350;
        treeOptions.width = treeOptions.width || "100%";

        treeOptions.animationShowDuration=120;
        treeOptions.animationHideDuration=120;

        this.widget.jqxTree(treeOptions);
        this.widget = $("#" + this.$id);

        if (this.props.onItemClick)
            this.widget.on("itemClick", (event: any) => {
                this.props.onItemClick!(event.args.element);
            });
        else
            this.widget.off("itemClick");

    }


    getSelectedRowIndex(): number {
        return this.widget.jqxTree("getselectedrowindex");
    }


    focus() {
        this.widget.jqxTree("focus");
    }

    render() {
        console.log("render Tree");

        return (
            <div id={this.$id}/>
        )
    }

}
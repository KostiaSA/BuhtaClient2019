import * as  React from "react";
import * as PropTypes from "prop-types";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";
import {isMouseRightClickEvent} from "../utils/isMouseRightClickEvent";


export interface ITreeProps extends IComponentProps {
    height?: string | number;
    width?: string | number;
    source?: any;
    onItemClick?: (rowItem: any) => Promise<void>;
    onItemDblClick?: (rowItem: any) => Promise<void>;
    popup?: React.ReactNode | ((rowItem: any) => Promise<React.ReactNode>);
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

    popup: React.ReactNode | null = null;
    popupLeft:number;
    popupTop:number;

    lastParentH: number;
    resizeIntervalId: any;

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);

        if (!this.props.height || this.props.height === "100%") {
            this.resizeIntervalId = setInterval(() => {
                let newH = this.widget.parent().height();

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
        let treeOptions: any = omit(props, ["children", "onItemClick", "onItemDblClick", "popup"]);
        treeOptions.height = treeOptions.height || "100%";
        treeOptions.width = treeOptions.width || "100%";

        treeOptions.animationShowDuration = 100;
        treeOptions.animationHideDuration = 100;

        this.widget.jqxTree(treeOptions);
        this.widget = $("#" + this.$id);

        if (this.props.onItemClick)
            this.widget.on("itemClick", (event: any) => {
                this.props.onItemClick!(event.args.element);
            });
        else
            this.widget.off("itemClick");

        this.bindItemDblClickEvent();
        this.bindMouseRightClickEvent();

    }

    bindMouseRightClickEvent() {
        // $("#jqxTree li").on('mousedown', function (event) {
        //     var target = $(event.target).parents('li:first')[0];
        //     var rightClick = isRightClick(event);
        //     if (rightClick && target != null) {
        //         $("#jqxTree").jqxTree('selectItem', target);
        //         var scrollTop = $(window).scrollTop();
        //         var scrollLeft = $(window).scrollLeft();
        //         contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
        //         return false;
        //     }
        // });

        if (this.props.onItemDblClick) {
            let $items = this.widget.find(".jqx-tree-item");
            $items.on("mousedown", async (event: MouseEvent) => {
                if (isMouseRightClickEvent(event)) {
                    let item = this.widget.jqxTree("getItem", $(event.target).parents("li")[0]);
                    if (!item.hasItems) { // не folder
                        this.widget.jqxTree('selectItem', item);
                        console.log("popup------------------click", item);
                        this.popup = this.props.popup;
                        let scrollTop = $(window).scrollTop();
                        let scrollLeft = $(window).scrollLeft();
                        this.popupLeft= event.clientX + 5 + scrollLeft!;
                        this.popupTop=event.clientY + 5 + scrollTop!;
                        this.forceUpdate();
                        //await this.props.onItemDblClick!(item);
                        // event.preventDefault();
                        // event.stopPropagation();
                        return true;
                    }
                }
            });
        }
        else
            this.widget.off("mousedown");
    }

    bindItemDblClickEvent() {

        if (this.props.onItemDblClick) {
            let $items = this.widget.find(".jqx-tree-item");
            $items.on("dblclick", async (event: any) => {

                let item = this.widget.jqxTree("getItem", $(event.target).parents("li")[0]);
                if (!item.hasItems) { // не folder
                    console.log("dblclick", item);
                    await this.props.onItemDblClick!(item);
                    return true;
                }
            });
        }
        else
            this.widget.off("dblclick");

    }


    // getSelectedRowIndex(): number {
    //     return this.widget.jqxTree("getselectedrowindex");
    // }


    focus() {
        this.widget.jqxTree("focus");
    }

    render() {
        console.log("render Tree");

        if (this.popup)
            return [React.cloneElement(this.popup as any, {key: "1"}), <div key="2" id={this.$id}/>];
        return (
            <div key="2" id={this.$id}/>
        )
    }

}
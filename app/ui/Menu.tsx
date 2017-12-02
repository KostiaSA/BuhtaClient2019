import * as  React from "react";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";


export interface IMenuProps extends IComponentProps {
    mode: "horizontal" | "vertical" | "popup";
    height?: string | number;
    width?: string | number;
}

export class Menu extends Component<IMenuProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        console.log("didmount TabsPanel " + this.$id);
        this.widget = $("#" + this.$id);
        this.updateProps(this.props);
    }

    updateProps(props: IMenuProps) {
        let opt: any = {
            ...omit(this.props, ["children"]),
            animationShowDuration: 0,
            animationHideDuration: 0,
            animationShowDelay: 0
        };

//          opt.height = opt.height || "auto";
//        opt.width = opt.width || "100%";

        this.widget.jqxMenu(opt);
        this.widget = $("#" + this.$id);
    }

    // renderHeaders(): React.ReactNode {
    //     return React.Children.toArray(this.props.children).map((child, index) => {
    //         return <li key={index}>{(child as any).props.title}</li>
    //     });
    // }

    render() {
        console.log("render Menu",this.props.children);
        return (
            <div id={this.$id} style={{zIndex: 8888}}>
                <ul style={{zIndex: 9999}}>
                    {this.props.children}
                </ul>
            </div>
        )
    }

}
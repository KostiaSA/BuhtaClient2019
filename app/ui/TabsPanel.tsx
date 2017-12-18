import * as  React from "react";
import {Component, IComponentProps} from "./Component";
import {omit} from "../utils/omit";


export interface ITabsPanelProps  extends IComponentProps{
    height?: string | number;
    width?: string | number;
}

export class TabsPanel extends Component<ITabsPanelProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        this.widget = $("#" + this.$id);
        //ReactDOM.render(<Div ref={(e)=>{this.content=e}}>{this.state.children}.......</Div>, document.getElementById(this.$contentId));
        this.updateProps(this.props);
    }

    updateProps(props: ITabsPanelProps) {
        let opt: any = omit(this.props, ["children"]);

        opt.height = opt.height || "auto";
        opt.width = opt.width || "100%";

        this.widget.jqxTabs(opt);
        this.widget = $("#" + this.$id);
    }

    renderHeaders(): React.ReactNode {
        return React.Children.toArray(this.props.children).map((child, index) => {
            return <li key={index}>{(child as any).props.title}</li>
        });
    }

    render() {
        //console.log("render TabsPanel");
        return (
            <div id={this.$id}>
                <ul>
                    {this.renderHeaders()}
                </ul>
                {this.props.children}
            </div>
        )
    }

}
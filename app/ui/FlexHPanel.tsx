import * as  React from "react";
import {Component} from "./Component";


export interface IHorzFlexPanelProps {
    height?: string | number;
}

export class FlexHPanel extends Component<IHorzFlexPanelProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        // console.log("didmount FlexHPanel " + this.$id);
        // this.widget = $("#" + this.$id);
        // //ReactDOM.render(<Div ref={(e)=>{this.content=e}}>{this.state.children}.......</Div>, document.getElementById(this.$contentId));
        // this.updateProps(this.props);
    }

    render() {
        console.log("render FlexHPanel");
        return (
            <div style={{display: "flex", flexDirection: "column", height:this.props.height || "100%"}}>
                    {this.props.children}
            </div>
        )
    }

}
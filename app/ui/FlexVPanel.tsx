import * as  React from "react";
import {Component, IComponentProps} from "./Component";


export interface IHorzVertPanelProps  extends IComponentProps{
    width?: string | number;
}

export class FlexVPanel extends Component<IHorzVertPanelProps> {

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
        console.log("render FlexVPanel");
        return (
            <div style={{display: "flex", flexDirection: "row", width:this.props.width || "100%"}}>
                    {this.props.children}
            </div>
        )
    }

}
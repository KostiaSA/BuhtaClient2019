import * as  React from "react";
import {Component} from "./Component";


export interface IFormPanelProps {

}

export class FormPanel extends Component<IFormPanelProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        // console.log("didmount FormPanel " + this.$id);
        // this.widget = $("#" + this.$id);
        // //ReactDOM.render(<Div ref={(e)=>{this.content=e}}>{this.state.children}.......</Div>, document.getElementById(this.$contentId));
        // this.updateProps(this.props);
    }


    renderItems(): React.ReactNode {
        return React.Children.toArray(this.props.children).map((child, index) => {
            return (
                <tr key={index}>
                    <td>
                        <div style={{height: (child as any).props.height}}>{(child as any).props.title}</div>
                    </td>
                    <td>
                        {child}
                    </td>
                </tr>
            )
        });
    }

    render() {
        console.log("render FormPanel");
        return (
            <table id={this.$id} style={{border: "none"}}>
                <tbody>
                    {this.renderItems()}
                </tbody>
            </table>
        )
    }

}
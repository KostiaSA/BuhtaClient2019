import * as  React from "react";
import {Component} from "../Component";
import {omit} from "../../utils/omit";


export interface IInputProps {
    height?: string | number;
    width?: string | number;
    placeHolder?: string;
}

export class Input extends Component<IInputProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        console.log("didmount Input " + this.$id);
        this.widget = $("#" + this.$id);
        //ReactDOM.render(<Div ref={(e)=>{this.content=e}}>{this.state.children}.......</Div>, document.getElementById(this.$contentId));
        this.updateProps(this.props, true);
    }

    updateProps(props: IInputProps, create: boolean) {
        let opt: any = omit(props, []);

        if (create) {
            opt.height = opt.height || 24;
        }

        this.widget.jqxInput(opt);
    }


    render() {
        console.log("render Input");
        return (
            <input id={this.$id} type="text"/>
        )
    }

}
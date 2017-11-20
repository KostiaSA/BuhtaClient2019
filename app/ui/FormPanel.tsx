import * as  React from "react";
import * as PropTypes from "prop-types";
import {Component} from "./Component";
import {clone} from "ejson";
import {reassignObject} from "../utils/reassignObject";


export interface IFormPanelProps {
    bindObj?: any;
}

export class FormPanel extends Component<IFormPanelProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static childContextTypes = {
        bindObj: PropTypes.object
    };

    static contextTypes = {
        bindObj: PropTypes.object
    };

    getChildContext() {
        return {bindObj: this.props.bindObj};
    }

    get bindObj(): any {
        let ret = this.props.bindObj || this.context.bindObj;
        return ret;
    }

    clonedBindObj: any;

    componentDidMount() {
        // console.log("didmount FormPanel " + this.$id);
        // this.widget = $("#" + this.$id);
        // //ReactDOM.render(<Div ref={(e)=>{this.content=e}}>{this.state.children}.......</Div>, document.getElementById(this.$contentId));
        // this.updateProps(this.props);
        if (this.bindObj) {
            this.clonedBindObj = clone(this.bindObj);
        }
    }

    cancelChanges() {
        if (this.bindObj && this.clonedBindObj) {
            reassignObject(this.bindObj, this.clonedBindObj);
        }
    }


    renderItems(): React.ReactNode {
        return React.Children.toArray(this.props.children).map((child, index) => {
            return (
                <tr key={index}>
                    <td>
                        <div style={{textAlign: "right", paddingRight: 8, height: (child as any).props.height}}>
                            {(child as any).props.title || (child as any).props.bindProp}
                        </div>
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
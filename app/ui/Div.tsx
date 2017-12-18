import * as  React from "react";
import * as  ReactDOM from "react-dom";

export class Div extends React.Component<any, any>{

    render() {
        //console.log("render Div",this.props.children);
        return (
            <div>
                {this.props.children}
            </div>

        )
    }

}
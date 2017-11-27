import * as  React from "react";
import {CSSProperties} from "react";


export interface ITabsPanelItemProps {
    title: string | React.ReactNode;
    height?: number;
    style?: CSSProperties
}

export class TabsPanelItem extends React.Component<ITabsPanelItemProps> {


    intervalId: any;

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    native: any;
    height: number;

    render() {
        return (
            <div
                ref={(e) => this.native = e}
                style={{border: "none", overflow: "hidden", height: this.height, padding:5, ...this.props.style}}
            >
                {this.props.children}
            </div>
        );
    }

}
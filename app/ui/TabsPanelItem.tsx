import * as  React from "react";


export interface ITabsPanelItemProps {
    title: string | React.ReactNode;
    height?: number;
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
                ref={(e) => {
                    this.native = e
                }}
                style={{border: "none", overflow: "hidden", height: this.height}}
            >
                {this.props.children}
            </div>
        );
    }

}
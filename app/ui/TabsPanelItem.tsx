import * as  React from "react";


export interface ITabsPanelItemProps {
    title: string | React.ReactNode;
    height?: number;
}

export class TabsPanelItem extends React.Component<ITabsPanelItemProps> {

    render() {
        return <div >{this.props.children}</div>;
    }

}
import * as  React from "react";


export interface ITabsPanelProps {
    title: string | React.ReactNode;
    height?: string | number;
}

export class TabsPanelItem extends React.Component<ITabsPanelProps> {

    render() {
        return <div>{ this.props.children}</div>;
    }

}
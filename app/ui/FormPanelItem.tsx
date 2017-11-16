import * as  React from "react";


export interface IFormPanelItemProps {
    title: string | React.ReactNode;
    height?: string | number;
}

export class FormPanelItem extends React.Component<IFormPanelItemProps> {

    render() {
        return <div style={{height: this.props.height}}>{ this.props.children}</div>;
    }

}
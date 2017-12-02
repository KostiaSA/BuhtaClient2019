import * as  React from "react";
import {CSSProperties} from "react";


export interface IMenuItemProps {
    title: string | React.ReactNode;
    style?: CSSProperties
    icon?: string;
    emptyIcon?: boolean;
    onClick?: () => Promise<void>;
}

export class MenuItem extends React.Component<IMenuItemProps> {


    intervalId: any;

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderItems(): React.ReactNode {

        if (this.props.children)
            return (
                <ul>
                    {this.props.children}
                </ul>

            );
        else
            return null;
    }

    //     return React.Children.toArray(this.props.children).map((child, index) => {
    //         return (
    //             <ul>
    //                 {this.props.children}
    //             </ul>
    //
    //             <li key={index}>{(child as any).props.title}</li>
    //         )
    //     });
    // }

    render() {
        return (
            <li
                onClick={() => {
                    if (this.props.onClick) this.props.onClick()
                }}
            >
                {this.props.icon ? <img style={{float: "left", marginRight: 5}} src={this.props.icon}/> : null}
                <span style={{marginLeft: (this.props.emptyIcon && !this.props.icon) ? 20 : 0}}>{this.props.title}</span>
                {this.renderItems()}
            </li>
        );
    }

}
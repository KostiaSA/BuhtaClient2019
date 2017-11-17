import * as  React from "react";


export interface ITabsPanelItemProps {
    title: string | React.ReactNode;
    height?: number;
}

export class TabsPanelItem extends React.Component<ITabsPanelItemProps> {


    intervalId: any;

    componentDidMount() {
        this.intervalId = setInterval(this.resize.bind(this), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    resize() {
        let $tabs = $(this.native).parents(".jqx-tabs").first();
        let tabsHeight = $tabs.height();
        if (tabsHeight === 0)
            clearInterval(this.intervalId);
        else {
            $("#a12345").parent().css("height",tabsHeight! - 48)
            $("#a12345").css("height",tabsHeight! - 48)
            //this.height = tabsHeight! - 28;
        }


        console.log("$tabs", tabsHeight);
    }

    native: any;
    height: number;

    render() {
        return (
            <div
                id="a12345"
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
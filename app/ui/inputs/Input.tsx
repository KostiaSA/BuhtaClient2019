import * as  React from "react";
import {CSSProperties} from "react";
import * as PropTypes from "prop-types";
import {Component} from "../Component";
import {omit} from "../../utils/omit";
import {objectPathGet} from "../../utils/objectPathGet";
import {stringify} from "ejson";
import {objectPathSet} from "../../utils/objectPathSet";


export interface IInputProps {
    title?: string | React.ReactNode;
    height?: string | number;
    width?: string | number;
    placeHolder?: string;
    bindObj?: any;
    bindProp: string;
}

export class Input extends Component<IInputProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    static contextTypes = {
        bindObj: PropTypes.object
    };

    get isChanged(): boolean {
        if (!this.initialValue)
            return false;
        else
            return stringify(this.initialValue) !== stringify(objectPathGet(this.props.bindObj || this.context.bindObj, this.props.bindProp));
    }

    initialValue: any;

    componentDidMount() {
        console.log("didmount Input " + this.$id);
        this.widget = $("#" + this.$id);
        //ReactDOM.render(<Div ref={(e)=>{this.content=e}}>{this.state.children}.......</Div>, document.getElementById(this.$contentId));
        this.updateProps(this.props, true);
        this.initialValue = objectPathGet(this.props.bindObj || this.context.bindObj, this.props.bindProp);
        this.widget.jqxInput("val", this.initialValue);
        this.widget.on("change",
            (event: any) => {
                //var type = event.args.type; // keyboard, mouse or null depending on how the value was changed.
                objectPathSet(this.props.bindObj || this.context.bindObj, this.props.bindProp, this.widget.val());
                this.forceUpdate();
                console.log("change");
            });
    }

    updateProps(props: IInputProps, create: boolean) {
        let opt: any = omit(props, ["bindObj", "bindProp", "title", "children"]);

        opt.height = opt.height || 24;
        opt.width = opt.width || 200;

        this.widget.jqxInput(opt);
    }


    render() {
        console.log("render Input");

        let style: CSSProperties = {};
        if (this.isChanged)
            style.color = "#2196F3";

        return (
            <input id={this.$id} style={style} type="text"/>
        )
    }

}
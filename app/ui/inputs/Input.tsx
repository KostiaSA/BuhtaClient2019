import * as  React from "react";
import {CSSProperties} from "react";
import * as Joi from "joi";
import {omit} from "../../utils/omit";
import {objectPathGet} from "../../utils/objectPathGet";
import {objectPathSet} from "../../utils/objectPathSet";
import {BaseInput, IBaseInputProps} from "./BaseInput";

export interface IInputProps extends IBaseInputProps {
    height?: string | number;
    width?: string | number;
    placeHolder?: string;
}

export class Input extends BaseInput<IInputProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        this.widget = $("#" + this.$id);
        this.updateProps(this.props, true);
        this.initialValue = objectPathGet(this.bindObj, this.props.bindProp);
        if (this.initialValue)
            this.widget.jqxInput("val", this.initialValue);
        this.widget.on("change",
            async (event: any) => {
                objectPathSet(this.bindObj, this.props.bindProp, this.widget.val());
                if (this.props.onChange) {
                    await this.props.onChange();
                }
                if (this.props.validator) {
                    this.validationResult = Joi.validate(this.bindObj, this.props.validator, {abortEarly: false});
                }

                this.forceUpdate();
                console.log("change");
            });
    }

    updateProps(props: IInputProps, create: boolean) {
        let opt: any = omit(props, ["bindObj", "bindProp", "title", "children", "onChange", "hidden", "validator"]);

        opt.height = opt.height || 24;
        opt.width = opt.width || 200;

        this.widget.jqxInput(opt);
    }

    renderValidationResult(): React.ReactNode {

        if (!this.validationResult || !this.validationResult.error) {
            return null;
        }
        else {
            // return (
            //     <Tooltip
            //         getPopupContainer={()=>{return findDOMNode(this.getWindow()) as any}}
            //         overlayStyle={{color:"red"}} title={"здесь ошибка здесь ошибка здесь ошибка здесь ошибка здесь ошибка"} placement="right" autoAdjustOverflow={false} visible>
            //         <img key={2} src="vendor/fugue/exclamation-red.png" title="жопа просто"/>
            //     </Tooltip >
            // )
            let errDetail = this.validationResult.error.details.find((detail: any) => detail.path.join(".") === this.props.bindProp);
            if (!errDetail)
                return null;
            console.log("this.validationResult", this.validationResult)
            return (
                <span title={errDetail!.message}
                      style={{
                          color: "crimson",
                          whiteSpace: "nowrap",
                          fontSize: 12,
                          fontStyle: "italic",
                          marginLeft: 3
                      }}>
                {" " + errDetail!.message.substr(0, 50)}
            </span>
            )
        }
    }

    render() {
        console.log("render Input");

        let style: CSSProperties = {};
        if (this.isChanged)
            style.color = "#2196F3";
        if (this.validationResult && this.validationResult.error)
            style.color = "crimson";

        return (
            [<input key={1} id={this.$id} style={style} type="text"/>, this.renderValidationResult()]
        )
    }

}
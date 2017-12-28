import * as  React from "react";

import {Window} from "../ui/Window";
import {omit} from "../utils/omit";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {Button} from "../ui/Button";
import {getErrorWindow} from "../ui/modals/showError";
import {config} from "../config";
import {ISchemaObjectDesignerProps, SchemaObjectBaseDesignerWindow} from "./SchemaObjectBaseDesignerWindow";


export interface ISchemaTableDesignerProps extends ISchemaObjectDesignerProps {
    //tableId?: string;
    //window?: IWindowProps;
}

export class SelectColorWindow extends SchemaObjectBaseDesignerWindow {

    saveButton: Button;
    closeButton: Button;
    error: any;
    errorTitle: string;
    window: Window;

    async componentDidMount() {

        try {

            this.colorRadioElement.checked = true;
            this.forceUpdate();

        }
        catch (error) {
            this.error = error;
            this.forceUpdate();
        }

    }

    handleClickSelectButton = async () => {
        // let selectedRows = this.columnsGrid.getSelectedRows();
        // if (selectedRows.length === 0) {
        //     await showError("ничего не выбрано");
        //     return;
        // }
        // this.window.close(selectedRows);
    };

    handleClickCloseButton = async () => {
        this.window.close();
    };


    renderColorsOrBackground(color: string): React.ReactNode {
        let onClick = () => {
            this.window.close(color);
        };
        let cellStyle = {cursor: "pointer", height: 20, verticalAlign: "middle"};
        if (this.isColorMode()) {
            return (
                <tr key={color}>
                    <td
                        style={{color: color, ...cellStyle}}
                        onClick={onClick}
                        className="select-color-td"
                    >
                        {color}
                    </td>
                    <td
                        style={{color: color, fontWeight: "bold", ...cellStyle}}
                        className="select-color-td"
                        onClick={onClick}
                    >
                        {color}
                    </td>
                    <td
                        style={{color: color, backgroundColor: "darkslategray", ...cellStyle}}
                        className="select-color-td"
                        onClick={onClick}
                    >
                        {color}
                    </td>
                    <td
                        style={{color: color, backgroundColor: "darkslategray", fontWeight: "bold", ...cellStyle}}
                        className="select-color-td"
                        onClick={onClick}
                    >
                        {color}
                    </td>
                </tr>
            )
        }
        else {
            return (
                <tr key={color}>
                    <td
                        style={{backgroundColor: color, color: "white", ...cellStyle}}
                        className="select-color-td"
                        onClick={onClick}
                    >
                        {color}
                    </td>
                    <td
                        style={{
                            color: "white",
                            backgroundColor: color,
                            fontWeight: "bold",
                            ...cellStyle
                        }}
                        className="select-color-td"
                        onClick={onClick}
                    >
                        {color}
                    </td>
                    <td
                        style={{backgroundColor: color, color: "darkslategray", ...cellStyle}}
                        className="select-color-td"
                        onClick={onClick}
                    >
                        {color}
                    </td>
                    <td
                        style={{
                            color: "darkslategray",
                            backgroundColor: color,
                            fontWeight: "bold",
                            ...cellStyle
                        }}
                        className="select-color-td"
                        onClick={onClick}
                    >
                        {color}
                    </td>
                </tr>
            )
        }
    }

    renderColors(group: any): React.ReactNode {
        return group.colors
            .map((color: string) => {
                return this.renderColorsOrBackground(color);
            });
    }

    renderGroups(): React.ReactNode {

        return config.htmlColorGroups.map((group: any, index: number) => {
            return ([
                <tr key={group.groupName}>
                    <td colSpan={4} style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "slategray",
                        paddingTop: index === 0 ? 5 : 20,
                        paddingBottom: 10
                    }}>{group.groupName}</td>
                </tr>,
                this.renderColors(group)
            ])
        });
    }

    colorRadioElement: HTMLInputElement;
    backgroundRadioElement: HTMLInputElement;

    isColorMode(): boolean {
        return !!(!this.colorRadioElement || this.colorRadioElement.checked);
    }


    render() {

        if (this.error) {
            return getErrorWindow(this.error, this.errorTitle);
        }


        //console.log("render SchemaTableDesignerWindow");
        return (
            <Window
                width={590}
                height={700}
                {...omit(this.props.window, ["children"])}
                storageKey="SelectColorWindow"
                title="Выбор цвета"
                icon="vendor/fugue/color-swatch.png"
                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    <FlexItem dock="top" style={{padding: 15}}>
                        <div>
                            <input
                                ref={(e) => this.colorRadioElement = e!}
                                type="radio" name="type" id="radio1" value="color"
                                onChange={() => this.forceUpdate()}
                            />
                            <label htmlFor="radio1">Color</label>
                            <input
                                ref={(e) => this.backgroundRadioElement = e!}
                                type="radio" name="type" id="radio2" value="background"
                                onChange={() => this.forceUpdate()}
                            />
                            <label htmlFor="radio2">Background</label>
                        </div>
                    </FlexItem>
                    <FlexItem dock="fill" style={{padding: 15, overflow: "auto"}}>
                        <table>
                            <tbody>
                            {this.renderGroups()}
                            </tbody>
                        </table>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        <Button imgSrc={config.button.cancelIcon}
                                text="Отмена"
                                ref={(e) => this.closeButton = e!}
                                onClick={this.handleClickCloseButton}/>
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )
    }

}
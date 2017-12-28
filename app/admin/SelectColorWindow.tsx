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

    colors: string[];

    async componentDidMount() {

        try {
            this.colors = config.CSS_COLOR_NAMES.map((color: string) => ({name: color, value: color, group: "Web"}));

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

    renderColors(group: string): React.ReactNode {


        return this.colors
            .filter((c: any) => c.group === group)
            .map((c: any) => {
                let onClick = () => {
                    this.window.close(c.value);
                };
                return (
                    <tr key={c.name}>
                        <td style={{color: c.value, paddingBottom: 6, cursor: "pointer"}} onClick={onClick}>{c.name}</td>
                        <td style={{color: c.value, paddingBottom: 6, fontWeight: "bold",cursor: "pointer"}}
                            onClick={onClick}>{c.name}</td>
                        <td style={{color: c.value, paddingBottom: 6, fontStyle: "italic",cursor: "pointer"}}
                            onClick={onClick}>{c.name}</td>
                        <td style={{
                            color: c.value,
                            paddingBottom: 6,
                            fontStyle: "italic",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                            onClick={onClick}
                        >{c.name}</td>
                        <td style={{color: "gray", cursor: "pointer", paddingBottom: 6}} onClick={onClick}>выбрать '{c.name}'</td>
                    </tr>
                )
            });
    }

    renderGroups(): React.ReactNode {
        if (!this.colors)
            return null;

        let groups = Array.from(new Set(this.colors.map((c: any) => c.group)));

        return groups.map((group: string) => {
            return (
                <div key={group}
                >
                    <div style={{fontSize: 15, fontWeight: "bold"}}>{group}</div>
                    <table>
                        <tbody>
                        {this.renderColors(group)}
                        </tbody>
                    </table>
                </div>
            )
        });
    }


    render() {

        if (this.error) {
            return getErrorWindow(this.error, this.errorTitle);
        }


        //console.log("render SchemaTableDesignerWindow");
        return (
            <Window
                {...omit(this.props.window, ["children"])}
                storageKey="SelectColorWindow"
                title="Выбор цвета"
                icon="vendor/fugue/color-swatch.png"
                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    <FlexItem dock="top">
                        фильтр по названию
                    </FlexItem>
                    <FlexItem dock="fill" style={{padding: 15, overflow: "auto"}}>
                        {this.renderGroups()}
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
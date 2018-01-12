import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {omit} from "../utils/omit";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {getErrorWindow} from "../ui/modals/showError";
import {config} from "../config";
import {Button} from "../ui/Button";
import {ComboBox} from "../ui/inputs/ComboBox";
import {getDatabasesList, IDatabase} from "../api/getDatabasesList";
import {DbGrid} from "../ui/DbGrid";
import {FormPanel} from "../ui/FormPanel";
import {FormPanelHGroup} from "../ui/FormPanelHGroup";
import {FlexVPanel} from "../ui/FlexVPanel";


export interface ISchemaTableColumnEditorProps {
    queryId?: string;
    window?: IWindowProps;
}

export class SchemaQueryTestRunWindow extends React.Component<ISchemaTableColumnEditorProps, any> {

    window: Window;
    error: any;
    testDatabase: IDatabase;
    dbGrid: DbGrid;

    async componentDidMount() {

        try {
            //console.log("this.objectsTree", this.objectsTree);
            this.forceUpdate();
        }
        catch (error) {
            this.error = error;
            this.forceUpdate();
        }

    }


    render() {
        console.log("SchemaExplorerWindow");

        if (this.error) {
            return getErrorWindow(this.error);
        }


        return (
            <Window
                {...omit(this.props.window, ["children"])}
                storageKey="SchemaQueryTestRunWindow"
                height={600}
                title={"Тестирование запроса: " + this.props.queryId}
                icon="buhta/assets/icons/query-run.png"

                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    <FlexItem dock="top" style={{padding: 5}}>
                        <FlexVPanel>
                            <FlexItem dock="fill" style={{padding: 0}}>
                                <FormPanel>
                                    <FormPanelHGroup>
                                        <ComboBox
                                            title="база данных"
                                            bindObj={this}
                                            bindProp="testDatabase"
                                            placeHolder="тип данных"
                                            valueMember="name"
                                            displayMember="name"
                                            width={200}
                                            source={getDatabasesList}
                                            resizable storageKey="input:testDatabase"
                                        />
                                    </FormPanelHGroup>
                                </FormPanel>
                            </FlexItem>
                            <FlexItem dock="right" style={{padding: 0}}>
                                <Button imgSrc={config.button.refreshIcon}
                                        text="Выполнить"
                                        onClick={async () => {
                                            await this.dbGrid.loadRows();
                                        }}
                                />
                            </FlexItem>
                        </FlexVPanel>

                    </FlexItem>
                    <FlexItem dock="fill" style={{padding: 5}}>
                        <DbGrid ref={(e) => this.dbGrid = e!} queryId={this.props.queryId}></DbGrid>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        <Button imgSrc={config.button.cancelIcon}
                                text="Закрыть"
                                onClick={async () => {
                                    this.window.close()
                                }}
                        />
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )

    }

}
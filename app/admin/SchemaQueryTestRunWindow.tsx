import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {omit} from "../utils/omit";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {getErrorWindow} from "../ui/modals/showError";
import {config} from "../config";
import {Button} from "../ui/Button";
import {SchemaQuery} from "../schema/query/SchemaQuery";
import {ComboBox} from "../ui/inputs/ComboBox";
import {getDatabasesList, IDatabase} from "../sql/getDatabasesList";
import {DbGrid} from "../ui/DbGrid";


export interface ISchemaTableColumnEditorProps {
    queryId?: string;
    window?: IWindowProps;
}

export class SchemaQueryTestRunWindow extends React.Component<ISchemaTableColumnEditorProps, any> {

    window: Window;
    error: any;
    testDatabase: IDatabase;

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
        //console.log("SchemaExplorerWindow");

        if (this.error) {
            return getErrorWindow(this.error);
        }


        return (
            <Window
                {...omit(this.props.window, ["children"])}
                storageKey="SchemaQueryTestRunWindow"
                height={600}
                title={"Тестирование запроса"}
                icon={SchemaQuery.icon}

                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    <FlexItem dock="top">
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

                    </FlexItem>
                    <FlexItem dock="fill" style={{padding: 5}}>
                        <DbGrid queryId={this.props.queryId}></DbGrid>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        <Button imgSrc={config.button.cancelIcon}
                                text="Закрыть"
                                onClick={async () => {
                                    this.window.close()
                                }}/>
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )

    }

}
import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {omit} from "../utils/omit";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {getErrorWindow} from "../ui/modals/showError";
import {config} from "../config";
import {Button} from "../ui/Button";
import {FlexVPanel} from "../ui/FlexVPanel";
import {SchemaQuery} from "../schema/query/SchemaQuery";
import {CodeEditor} from "../ui/inputs/CodeMirror";
import {TabsPanelItem} from "../ui/TabsPanelItem";
import {TabsPanel} from "../ui/TabsPanel";


export interface ISchemaQueryDesignerSqlProps {
    window?: IWindowProps;
    sql: string;
}


export class SchemaQueryDesignerSqlWindow extends React.Component<ISchemaQueryDesignerSqlProps> {

    window: Window;
    error: any;

    async componentDidMount() {

        try {
            this.sql = this.props.sql;
            this.forceUpdate();
        }
        catch (error) {
            this.error = error;
            this.forceUpdate();
        }

    }

    componentDidUpdate() {

    }

    sql: string;
    mssql: string;
    mysql: string;
    postgress: string;

    render() {
        console.log("SchemaQueryDesignerSqlWindow");

        if (this.error) {
            return getErrorWindow(this.error);
        }

        if (!this.sql) {
            return null;
        }

        return (
            <Window
                {...omit(this.props.window, ["children"])}
                storageKey="SchemaQueryDesignerSqlWindow"
                height={600}
                width={900}
                title={"SQL-шаблон запроса"}
                icon={SchemaQuery.icon}

                ref={(e) => {
                    this.window = e!
                }}>

                <FlexHPanel>
                    {/**************************** шапка *************************/}
                    <FlexItem dock="top" style={{height: 100, padding: 5}}>
                        шапка
                    </FlexItem>
                    {/**************************** тестовый редактор *************/}
                    <FlexItem dock="fill" style={{padding: 5, paddingBottom: 2, border: "0px solid green"}}>
                        <TabsPanel>

                            <TabsPanelItem title="SQL-шаблон">
                                <CodeEditor title="" bindObj={this} bindProp="sql"/>
                            </TabsPanelItem>

                            <TabsPanelItem title="результат в MSSQL">
                                <CodeEditor title="" bindObj={this} bindProp="mssql"/>
                            </TabsPanelItem>

                            <TabsPanelItem title="результат в MySQL">
                                <CodeEditor title="" bindObj={this} bindProp="mysql"/>
                            </TabsPanelItem>

                            <TabsPanelItem title="результат в Postgres">
                                <CodeEditor title="" bindObj={this} bindProp="postgress"/>
                            </TabsPanelItem>

                        </TabsPanel>
                        {/*<div style={{flex: 1}}>*/}
                            {/*<CodeEditor title="" bindObj={this} bindProp="sql"/>*/}
                        {/*</div>*/}
                    </FlexItem>
                    {/**************************** нижние кнопки ***************************/}
                    <FlexItem dock="bottom" style={{padding: 5, paddingTop: 10 /*justifyContent: "flex-end"*/}}>
                        <FlexVPanel>
                            <FlexItem dock="left">
                            </FlexItem>
                            <FlexItem dock="fill" style={{justifyContent: "flex-end"}}>
                                <Button
                                    imgSrc={config.button.cancelIcon}
                                    text="Закрыть"
                                    onClick={async () => {
                                        this.window.close()
                                    }}
                                />
                            </FlexItem>
                        </FlexVPanel>
                    </FlexItem>
                </FlexHPanel>
            </Window>
        )
    }
}
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
import {CodeEditor} from "../ui/inputs/CodeEditor";
import {TabsPanelItem} from "../ui/TabsPanelItem";
import {TabsPanel} from "../ui/TabsPanel";
import {generateSqlFromTemplate} from "./api/generateSqlFromTemplate";


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
            this.mssql = await generateSqlFromTemplate("mssql", this.props.sql, {});
            this.mysql = await generateSqlFromTemplate("mysql", this.props.sql, {});
            this.postgres = await generateSqlFromTemplate("postgres", this.props.sql, {});
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
    postgres: string;

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
                    <FlexItem dock="top" style={{height: 30, padding: 5}}>
                        шапка
                    </FlexItem>
                    {/**************************** тестовый редактор *************/}
                    <FlexItem dock="fill" style={{padding: 5, paddingBottom: 2, border: "0px solid green"}}>
                        <TabsPanel>

                            <TabsPanelItem title="SQL-шаблон">
                                <CodeEditor title="" options={{mode: "text/x-mssql", theme:"sql-template"}} bindObj={this} bindProp="sql"/>
                            </TabsPanelItem>

                            <TabsPanelItem title="результат в MSSQL">
                                <CodeEditor title="" options={{mode: "text/x-mssql", theme:"sql"}} bindObj={this} bindProp="mssql"/>
                            </TabsPanelItem>

                            <TabsPanelItem title="результат в MySQL">
                                <CodeEditor title="" options={{mode: "text/x-mysql", theme:"sql"}} bindObj={this} bindProp="mysql"/>
                            </TabsPanelItem>

                            <TabsPanelItem title="результат в Postgres">
                                <CodeEditor title="" options={{mode: "text/x-pgsql", theme:"sql"}} bindObj={this}
                                            bindProp="postgres"/>
                            </TabsPanelItem>

                        </TabsPanel>
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
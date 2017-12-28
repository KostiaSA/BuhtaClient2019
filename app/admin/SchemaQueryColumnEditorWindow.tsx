import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {TabsPanel} from "../ui/TabsPanel";
import {TabsPanelItem} from "../ui/TabsPanelItem";
import {omit} from "../utils/omit";
import {FormPanel} from "../ui/FormPanel";
import {Input} from "../ui/inputs/Input";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {Button} from "../ui/Button";
import {ISchemaQueryColumnProps, ISchemaQueryProps, SchemaQuery} from "../schema/query/SchemaQuery";
import {config} from "../config";
import {showError} from "../ui/modals/showError";
import {joiValidate} from "../validation/joiValidate";
import {getConfirmation} from "../ui/modals/getConfirmation";
import {CheckBox} from "../ui/inputs/CheckBox";
import {CodeEditor} from "../ui/inputs/CodeEditor";
import {ComboBox} from "../ui/inputs/ComboBox";


export interface ISchemaQueryColumnEditorProps {
    query?: ISchemaQueryProps;
    column?: ISchemaQueryColumnProps;
    window?: IWindowProps;
}

export class SchemaQueryColumnEditorWindow extends React.Component<ISchemaQueryColumnEditorProps, any> {

    window: Window;
    form: FormPanel | null;
    inlineSqlMode: boolean;

    componentWillMount() {
        this.inlineSqlMode = !!this.props.column!.inlineSql;
    }

    componentDidMount() {

    }

    handleDataTypeChange = async () => {
        this.forceUpdate();
    };

    getSortComboBoxlist(): any {
        return [
            {id: undefined, name: "<нет>"},
            {id: "asc1", name: "asc1"},
            {id: "asc2", name: "asc2"},
            {id: "asc3", name: "asc3"},
            {id: "asc4", name: "asc4"},
            {id: "asc5", name: "asc5"},
            {id: "desc1", name: "desc1"},
            {id: "desc2", name: "desc2"},
            {id: "desc3", name: "desc3"},
            {id: "desc4", name: "desc4"},
            {id: "desc5", name: "desc5"},
        ]
    }

    render() {
        console.log("SchemaQueryColumnEditorWindow");
        let col = this.props.column!;
        // if (!col.dataType) {
        //     col.dataType = {} as any;
        // }
        // if (!col.dataType.id) {
        //     col.dataType.id = StringSqlDataType.id;
        //     // let dt = appState.sqlDataTypes[StringSqlDataType.id];
        //     // dt.setDefaultProps(col.dataType);
        // }

        let validator = new SchemaQuery(this.props.query!).getColumnValidator();

        return (
            <Window
                {...omit(this.props.window, ["children"])}
                title={"колонка: " + this.props.column!.fieldSource}
                icon="vendor/fugue/table-insert-column.png"
                storageKey="SchemaQueryColumnEditorWindow"
                ref={(e) => {
                    this.window = e!
                }}>
                {/*Дизайнер колонки {this.props.ta??bleId}*/}

                <FlexHPanel>
                    <FlexItem dock="top">
                        запрос: XXX
                    </FlexItem>
                    <FlexItem dock="fill">
                        <TabsPanel>

                            <TabsPanelItem title="Колонка" style={{}}>
                                <FormPanel
                                    ref={(e) => this.form = e}
                                    bindObj={this.props.column}
                                    validator={validator}
                                >
                                    <Input title="подпись/alias" bindProp="fieldCaption" placeHolder="имя колонки"
                                           width={300}
                                           resizable storageKey="input:SchemaQuery.fieldCaption"

                                    />
                                    <CodeEditor title="inline SQL" bindProp="inlineSql" height={150}
                                                options={{mode: "text/x-mssql", theme: "sql-template"}}
                                                resizable storageKey="input:SchemaQuery.inlineSql"
                                                hidden={!this.inlineSqlMode}


                                    />
                                    <ComboBox
                                        title="сортировка"
                                        bindProp="orderBy"
                                        valueMember="id"
                                        displayMember="name"
                                        width={100}
                                        placeHolder="<нет>"
                                        source={this.getSortComboBoxlist()}
                                    />

                                    <CheckBox title="скрытая" bindProp="isHidden" width={300}/>
                                    <CheckBox title="отключена" bindProp="isDisabled" width={300}/>
                                </FormPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="В списках">
                                <FlexHPanel>
                                    <FlexItem dock="top" style={{padding: 5}}>
                                        фильтр по названию
                                    </FlexItem>
                                    <FlexItem dock="fill" style={{padding: 5}}>
                                    </FlexItem>
                                    <FlexItem dock="bottom" style={{padding: 5, height: 38}}>
                                    </FlexItem>
                                </FlexHPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="В формах">
                                индексы контент
                            </TabsPanelItem>

                        </TabsPanel>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        <Button
                            imgSrc={config.button.saveIcon}
                            text="Сохранить"
                            style={{marginRight: 5}}
                            onClick={async () => {

                                // // удаление лишних props
                                // let dataType = appState.sqlDataTypes[this.props.column!.dataType.id];
                                // if (dataType)
                                //     this.props.column!.dataType = dataType.copyProps(this.props.column!.dataType);

                                let validationError = joiValidate(this.props.column!, validator);

                                if (validationError) {
                                    await showError(validationError);
                                }
                                else {
                                    this.window.close(true);
                                }
                            }}
                        />
                        <Button
                            imgSrc={config.button.cancelIcon}
                            text="Отмена"
                            onClick={async () => {
                                this.form!.cancelChanges();
                                if (!this.form!.needSaveChanges || await getConfirmation("Выйти без сохранения?"))
                                    this.window.close(false);
                            }}
                        />
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )
    }

}
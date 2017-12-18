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
import {ComboBox} from "../ui/inputs/ComboBox";
import {appState} from "../AppState";
import {StringSqlDataType} from "../schema/table/datatypes/StringSqlDataType";
import {config} from "../config";
import {showError} from "../ui/modals/showError";
import {joiValidate} from "../validation/joiValidate";
import {getConfirmation} from "../ui/modals/getConfirmation";
import {CheckBox} from "../ui/inputs/CheckBox";


export interface ISchemaQueryColumnEditorProps {
    query?: ISchemaQueryProps;
    column?: ISchemaQueryColumnProps;
    window?: IWindowProps;
}

export class SchemaQueryColumnEditorWindow extends React.Component<ISchemaQueryColumnEditorProps, any> {

    window: Window;

    form: FormPanel | null;

    // getDataTypesSource(): any[] {
    //     let ret: any[] = [];
    //     for (let dataTypeId in appState.sqlDataTypes) {
    //         ret.push({id: dataTypeId, name: appState.sqlDataTypes[dataTypeId].getName()});
    //     }
    //     return ret;
    // }

    // renderDataTypeEditors(): React.ReactNode {
    //     let ret: React.ReactNode[] = [];
    //     for (let dataTypeId in appState.sqlDataTypes) {
    //         let dt = appState.sqlDataTypes[dataTypeId];
    //         ret.push(dt.renderPropsEditors(this.props.column!.dataType));
    //     }
    //     return ret;
    // }

    handleDataTypeChange = async () => {
        this.forceUpdate();
    };

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
                                    <Input title="подпись/alias" bindProp="fieldCaption" placeHolder="имя колонки" width={300}
                                           resizable storageKey="input:SchemaQuery.fieldCaption"

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
                                //this.form1!.cancelChanges();
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
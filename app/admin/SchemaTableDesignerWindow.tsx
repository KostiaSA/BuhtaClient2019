import * as  React from "react";
import {IWindowProps, Window} from "../ui/Window";
import {TabsPanel} from "../ui/TabsPanel";
import {TabsPanelItem} from "../ui/TabsPanelItem";
import {omit} from "../utils/omit";
import {FormPanel} from "../ui/FormPanel";
import {FormPanelItem} from "../ui/FormPanelItem";
import {Input} from "../ui/inputs/Input";
import {FlexHPanel} from "../ui/FlexHPanel";
import {FlexItem} from "../ui/FlexItem";
import {Grid} from "../ui/Grid";
import {GridColumn} from "../ui/GridColumn";
import {Button} from "../ui/Button";


export interface ISchemaTableDesignerProps {
    tableId?: string;
    window?: IWindowProps;
}

export class SchemaTableDesignerWindow extends React.Component<ISchemaTableDesignerProps, any> {
    //table: any = {name: "Организация", sqlName: "_Организация_", note:"это такая таблица"};
    table: any = {
        "className": "SchemaTable",
        "name": "Автомобиль",
        "description": "Список автомобилей",
        "columns": [
            {
                "name": "Ключ",
                "primaryKey": true,
                "dataType": {
                    "className": "IntegerSqlDataType",
                    "size": "32"
                },
                "description": "pos 0"
            },
            {
                "name": "Марка",
                "dataType": {
                    "className": "StringSqlDataType",
                    "maxLen": 100
                },
                "description": "pos 1"
            },
            {
                "name": "Госномер",
                "dataType": {
                    "className": "StringSqlDataType",
                    "maxLen": 20
                },
                "description": "pos 2"
            },
            {
                "name": "Гаражный номер",
                "dataType": {
                    "className": "StringSqlDataType",
                    "maxLen": 50
                },
                "description": "pos 3"
            },
            {
                "name": "Грузоподъемность",
                "dataType": {
                    "className": "IntegerSqlDataType",
                    "size": "32"
                },
                "description": "pos 4"
            },
            {
                "name": "Номер и название",
                "dataType": {
                    "className": "StringSqlDataType",
                    "maxLen": 117
                },
                "description": "pos 5"
            },
            {
                "name": "ИНН ТС",
                "dataType": {
                    "className": "StringSqlDataType",
                    "maxLen": 30
                },
                "description": "pos 6"
            },
            {
                "name": "Мощность",
                "dataType": {
                    "className": "IntegerSqlDataType",
                    "size": "32"
                },
                "description": "pos 7"
            },
            {
                "name": "Номер",
                "dataType": {
                    "className": "StringSqlDataType",
                    "maxLen": 20
                },
                "description": "pos 8"
            },
            {
                "name": "Код вида ТС",
                "dataType": {
                    "className": "StringSqlDataType",
                    "maxLen": 10
                },
                "description": "pos 9"
            }
        ]
    };

    render() {
        console.log("SchemaTableDesignerWindow");
        // let props=this.props.window || {};
        // delete props.children;
        //<Window {...this.props.window}>
        return (
            <Window {...omit(this.props.window, ["children"])}>
                {/*Дизайнер таблицы {this.props.tableId}*/}

                <FlexHPanel>
                    <FlexItem dock="top">
                        таблица: XXX
                    </FlexItem>
                    <FlexItem dock="fill">
                        <TabsPanel>

                            <TabsPanelItem title="Таблица">
                                <FlexHPanel>
                                    <FlexItem dock="top" style={{padding: 5}}>
                                        таблица контент ЗАГОЛОВОК
                                    </FlexItem>
                                    <FlexItem dock="fill" style={{padding: 5}}>
                                        <FormPanel bindObj={this.table}>
                                            <FormPanelItem title="имя">
                                                <Input bindObj={this.table} bindProp="name" placeHolder="имя таблицы"/>
                                            </FormPanelItem>
                                            <FormPanelItem title="описание">
                                                <Input bindProp="description" placeHolder="введите sql имя таблицы"/>
                                            </FormPanelItem>
                                            <Input width={400} bindProp="note" placeHolder="note"
                                                   title={<span style={{color: "red"}}>SchemaObject:</span>}/>
                                        </FormPanel>
                                    </FlexItem>
                                    <FlexItem dock="top" style={{padding: 5}}>
                                        таблица контент ФУТТЕР
                                    </FlexItem>
                                </FlexHPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="Колонки">
                                <FlexHPanel>
                                    <FlexItem dock="top" style={{padding: 5}}>
                                        фильтр по названию
                                    </FlexItem>
                                    <FlexItem dock="fill" style={{padding: 5}}>
                                        <Grid source={this.table.columns}>
                                            <GridColumn text="Колонка" datafield="name"/>
                                            <GridColumn text="Описание" datafield="description"/>
                                        </Grid>
                                    </FlexItem>
                                    <FlexItem dock="bottom" style={{padding: 5, height:38}}>
                                        <Button imgSrc="vendor/fugue/icons/plus.png" text="Добавить колонку" height={26} style={{marginRight: 5, marginTop:8}}/>
                                        <Button imgSrc="vendor/fugue/icons/card--pencil.png" text="Изменить" height={26} style={{marginRight: 5, marginTop:8}}/>
                                        <Button imgSrc="vendor/fugue/icons/cross.png" text="Удалить" height={26} style={{marginRight: 5, marginTop:8}}/>
                                    </FlexItem>
                                </FlexHPanel>
                            </TabsPanelItem>

                            <TabsPanelItem title="Индексы">
                                индексы контент
                            </TabsPanelItem>

                        </TabsPanel>
                    </FlexItem>
                    <FlexItem dock="bottom" style={{padding: 5, justifyContent: "flex-end"}}>
                        <Button imgSrc="vendor/fugue/icons/disk.png" text="Сохранить" style={{marginRight: 5}}/>
                        <Button imgSrc="vendor/fugue/icons/cross-script.png" text="Отмена"/>
                    </FlexItem>
                </FlexHPanel>


            </Window>

        )
    }

}
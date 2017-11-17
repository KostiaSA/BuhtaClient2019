
class TestWindow extends SchemaWindow {
    render(props){
        return (
            <Window {...props}>
                <div>это TestWindow из схемы1</div>
                <div>это TestWindow из схемы2 это TestWindow из схемы2</div>
                <div>это TestWindow из схемы3</div>
                <TabsPanel height="100%">
                    <TabsPanelItem title="Таблица">
                        таблица контент --77777777
                        <FormPanel>
                            <FormPanelItem title="имя">
                                <Input placeHolder="имя таблицы"/>
                            </FormPanelItem>
                            <FormPanelItem title="sql-имя">
                                <Input placeHolder="введите sql имя таблицы"/>
                            </FormPanelItem>
                        </FormPanel>
                    </TabsPanelItem>
                    <TabsPanelItem title="Колонки">
                        колонки контент 99999999999
                    </TabsPanelItem>
                    <TabsPanelItem title="Индексы">
                        индексы контент 88888888888
                    </TabsPanelItem>
                </TabsPanel>

            </Window>
        )
    }
}

console.log("загружен TestWindow 1");

class TestWindow extends SchemaWindow {
    render(props){
        return (
            <Window {...props}>
                <div>это TestWindow из схемы1</div>
                <div>это TestWindow из схемы2 это TestWindow из схемы2</div>
                <div>это TestWindow из схемы3</div>
            </Window>
        )
    }
}

console.log("загружен TestWindow 1");
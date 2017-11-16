
class TestWindow extends SchemaWindow {
    render(props){
        return (
            <Window {...props}>
                <div>это TestWindow из схемы</div>
            </Window>
        )
    }
}

console.log("загружен TestWindow 1");
import * as  React from "react";
import {Window} from "../Window";
import {appState} from "../../AppState";
import {Button} from "../Button";
import {FlexItem} from "../FlexItem";
import {FlexHPanel} from "../FlexHPanel";

export async function showError(message: React.ReactNode, title:string="Ошибка") {
    let w: Window;
    let win = (
        <Window
            title={title}
            isModal
            icon="vendor/fugue/exclamation-red.png"
            minHeight={150}
            maxHeight={600}
            minWidth={300}
            maxWidth={600}
            width={300}
            ref={(e) => w = e!}
        >

            <FlexHPanel>
                <FlexItem dock="fill" style={{color: "crimson", padding: 10, marginTop:0, justifyContent: "center", overflow:"auto"}}>
                    {message}
                </FlexItem>
                <FlexItem dock="bottom" style={{padding: 5, justifyContent: "center"}}>
                    <Button
                        imgSrc="vendor/fugue/cross-script.png"
                        text="Закрыть"
                        onClick={async () => w.close()}/>
                </FlexItem>
            </FlexHPanel>

        </Window>
    );

    await appState.desktop.openWindow(win);
}
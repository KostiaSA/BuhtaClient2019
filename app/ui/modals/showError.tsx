import * as  React from "react";
import {Window} from "../Window";
import {appState} from "../../AppState";
import {Button} from "../Button";
import {FlexItem} from "../FlexItem";
import {FlexHPanel} from "../FlexHPanel";
import {Keycode} from "../../utils/Keycode";
import {isString} from "util";

export function getErrorWindow(message: React.ReactNode, title: string = "Ошибка"): React.ReactElement<any> {
    let w: Window;

    let renderMessage = (): React.ReactNode => {
        if (isString(message))
            // делаем многострочные сообщения
            return (
                <span>
                    {message.toString().split("\n").map((str: string, index: number) => {
                        return [<span key={index * 2}>{str}</span>, <br key={index * 2 + 1}/>];
                    })}
                </span>
            );
        else
            return message;
    };

    return (
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
            onKeyDown={async (keyCode: number) => {
                if (keyCode === Keycode.Escape)
                    w.close();
            }}

        >

            <FlexHPanel>
                <FlexItem dock="fill" style={{
                    color: "crimson",
                    padding: 10,
                    marginTop: 0,
                    justifyContent: "center",
                    overflow: "auto"
                }}>
                    {renderMessage()}
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

}

export async function showError(message: React.ReactNode, title: string = "Ошибка") {
    await appState.desktop.openWindow(getErrorWindow(message, title));
}
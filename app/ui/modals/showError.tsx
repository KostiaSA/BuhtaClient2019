import * as  React from "react";
import {Window} from "../Window";
import {appState} from "../../AppState";
import {Button} from "../Button";
import {FlexItem} from "../FlexItem";
import {FlexHPanel} from "../FlexHPanel";
import {Keycode} from "../../utils/Keycode";
import {isString} from "util";

export function getErrorWindow(message: any, title: string = "Ошибка"): React.ReactElement<any> {
    let w: Window;


    let renderMultiline = (str: string): React.ReactNode => {
        // делаем многострочные сообщения
        return (
            <span>
                 {str.toString().split("\n").map((str: string, index: number) => {
                     return [<span key={index * 2}>{str}</span>, <br key={index * 2 + 1}/>];
                 })}
             </span>
        );

    };

    let renderMessage = (): React.ReactNode => {
        if (message.$$typeof)
            return message;
        else if (isString(message))
            return renderMultiline(message);
        else if (isString(message.message))
            return renderMultiline(message.message);
        else if (message.toString)
            return renderMultiline(message.toString());
        else {
            console.error("неизвестный формат ошибки", message);
            return "неизвестный формат ошибки";
        }
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

export async function showError(message: any, title: string = "Ошибка") {
    await appState.desktop.openWindow(getErrorWindow(message, title));
}
import * as  React from "react";
import {Window} from "../Window";
import {appState} from "../../AppState";
import {Button} from "../Button";
import {FlexItem} from "../FlexItem";
import {FlexHPanel} from "../FlexHPanel";
import {Keycode} from "../../utils/Keycode";
import {isString} from "util";
import {config} from "../../const/config";
import {getTextWidth} from "../../utils/getTextWidth";

export function getErrorWindow(message: any, title: string = "Ошибка"): React.ReactElement<any> {
    let w: Window;
    let maxTextWidth = 0;

    let renderMultiline = (text: string): React.ReactNode => {
        // делаем многострочные сообщения
        return (
            <span>
                 {text.toString().split("\n").map((str: string, index: number) => {
                     let textWidth = getTextWidth(str);
                     if (textWidth > maxTextWidth)
                         maxTextWidth = textWidth;
                     return [<span key={index * 2}>{str}</span>, <br key={index * 2 + 1}/>];
                 })}
             </span>
        );

    };

    let renderJoi = (joiMessage: any): React.ReactNode => {
        if (message.details && message.details.length > 0) {

            return (
                <div>
                    {message.details.map((detail: any, index: number) => {
                        let str = "\"" + detail.path.join(".") + "\" " + detail.message.replace("\"", "(").replace("\"", ")");
                        let textWidth = getTextWidth(str);
                        if (textWidth > maxTextWidth)
                            maxTextWidth = textWidth;
                        return <div key={index}>{str}</div>
                    })}
                </div>
            )
        }
        else
            return message.toString();
    };

    // let renderJoi = (joiMessage: any): React.ReactNode => {
    //     if (message.details && message.details.length > 0) {
    //         return (
    //             <div>
    //                 {message.details.map((detail: any, index: number) => {
    //                     let msg = detail.message.split(":")[1] || detail.message;
    //                     return <div key={index}>"{detail.path.join(".")}" {msg}</div>
    //                 })}
    //             </div>
    //         )
    //     }
    //     else
    //         return message.toString();
    // };


    let renderMessage = (): React.ReactNode => {
        if (!message) {
            maxTextWidth = getTextWidth("ошибка?");
            return "ошибка?";
        }
        else if (message.$$typeof) {
            maxTextWidth = 600;
            return message;
        }
        else if (message.isJoi) {
            return renderJoi(message);
        }
        else if (isString(message)) {
            return renderMultiline(message);
        }
        else if (isString(message.message)) {
            return renderMultiline(message.message);
        }
        else if (message.toString) {
            return renderMultiline(message.toString());
        }
        else {
            maxTextWidth = getTextWidth("неизвестный формат ошибки");
            console.error("неизвестный формат ошибки", message);
            return "неизвестный формат ошибки";
        }
    };

    let renderedMessage=renderMessage();

    return (
        <Window
            title={title}
            isModal
            icon="vendor/fugue/exclamation-red.png"
            minHeight={150}
            maxHeight={600}
            minWidth={200}
            maxWidth={700}
            width={Math.min(maxTextWidth * 1.2, 700)}
            ref={(e) => w = e!}
            onKeyDown={async (keyCode: number): Promise<boolean> => {
                if (keyCode === Keycode.Escape) {
                    w.close();
                    return true;
                }
                else
                    return false;
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
                    {renderedMessage}
                </FlexItem>
                <FlexItem dock="bottom" style={{padding: 5, justifyContent: "center"}}>
                    <Button
                        imgSrc={config.button.cancelIcon}
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
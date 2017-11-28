import * as  React from "react";
import {Window} from "../Window";
import {appState} from "../../AppState";
import {Button} from "../Button";
import {FlexItem} from "../FlexItem";
import {FlexHPanel} from "../FlexHPanel";
import {Keycode} from "../../utils/Keycode";
import {isString} from "util";
import {config} from "../../const/config";

export function getErrorWindow(message: any, title: string = "Ошибка"): React.ReactElement<any> {
    let w: Window;

    //debugger

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

    let renderJoi = (joiMessage: any): React.ReactNode => {
        if (message.details && message.details.length > 0) {
            return (
                <div>
                    {message.details.map((detail: any, index: number) => {
                        let msg = detail.message.split(":")[1] || detail.message;
                        return <div key={index}>"{detail.path.join(".")}" {msg}</div>
                    })}
                </div>
            )
        }
        else
            return message.toString();
    };


    let renderMessage = (): React.ReactNode => {
        if (!message)
            return "ошибка?";
        else if (message.$$typeof)
            return message;
        else if (message.isJoi)
            return renderJoi(message);
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
                    {renderMessage()}
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
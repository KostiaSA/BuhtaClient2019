import * as  React from "react";
import {Window} from "../Window";
import {appState} from "../../AppState";
import {Button} from "../Button";
import {FlexItem} from "../FlexItem";
import {FlexHPanel} from "../FlexHPanel";
import {Keycode} from "../../utils/Keycode";
import {config} from "../../const/config";
import {getTextWidth} from "../../utils/getTextWidth";
import {isString} from "util";

export function getGetConfirmationWindow(message: React.ReactNode, title: string = "Подтверждение", yesButtonText: string = "Да", noButtonText: string = "Нет"): React.ReactElement<any> {
    let win: Window;

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

    if (isString(message)) {
        message = renderMultiline(message);
    }
    else {
        maxTextWidth = 400;
    }

    return (
        <Window
            title={title}
            isModal
            icon="vendor/fugue/exclamation.png"
            minHeight={150}
            maxHeight={600}
            minWidth={300}
            maxWidth={700}
            width={Math.min(maxTextWidth * 1.2, 700)}
            ref={(e) => win = e!}
            onKeyDown={async (keyCode: number): Promise<boolean> => {
                if (keyCode === Keycode.Escape) {
                    win.close();
                    return true;
                }
                else if (keyCode === Keycode.Enter) {
                    win.close(true);
                    return true;
                }
                else
                    return false;

            }}
        >

            <FlexHPanel>
                <FlexItem dock="fill" style={{
                    color: "black",
                    padding: 10,
                    marginTop: 0,
                    justifyContent: "center",
                    overflow: "auto",
                    textAlign: "center"
                }}>
                    {message}
                </FlexItem>
                <FlexItem dock="bottom" style={{padding: 5, justifyContent: "center"}}>
                    <Button
                        imgSrc={config.button.okIcon}
                        text={yesButtonText}
                        tooltip={yesButtonText + " (ENTER)"}
                        style={{marginRight: 10, border: config.button.focusedBorder}}
                        onClick={async () => win.close(true)}
                    />
                    <Button
                        imgSrc={config.button.cancelIcon}
                        text={noButtonText}
                        tooltip={noButtonText + " (ESC)"}
                        onClick={async () => win.close()}
                    />
                </FlexItem>
            </FlexHPanel>

        </Window>
    );

}

export async function getConfirmation(message: React.ReactNode, title: string = "Подтверждение", yesButtonText: string = "Да", noButtonText: string = "Нет") {
    return appState.desktop.openWindow(getGetConfirmationWindow(message, title, yesButtonText, noButtonText));
}
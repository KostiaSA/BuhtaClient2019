import * as  React from "react";
import {Window} from "../Window";
import {appState} from "../../AppState";
import {Button} from "../Button";
import {FlexItem} from "../FlexItem";
import {FlexHPanel} from "../FlexHPanel";
import {Keycode} from "../../utils/Keycode";

export function getGetConfirmationWindow(message: React.ReactNode, title: string = "Подтверждение", yesButtonText: string = "Да", noButtonText: string = "Нет"): React.ReactElement<any> {
    let w: Window;
    return (
        <Window
            title={title}
            isModal
            icon="vendor/fugue/exclamation.png"
            minHeight={150}
            maxHeight={600}
            minWidth={300}
            maxWidth={600}
            width={300}
            ref={(e) => w = e!}
            onKeyDown={async (keyCode: number) => {
                if (keyCode===Keycode.Escape)
                    w.close();
                else
                if (keyCode===Keycode.Enter)
                    w.close(true);
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
                        imgSrc="vendor/fugue/tick.png"
                        text={yesButtonText}
                        tooltip={yesButtonText+" (ENTER)"}
                        style={{marginRight: 10, border: "1px solid dodgerblue"}}
                        onClick={async () => w.close(true)}
                    />
                    <Button
                        imgSrc="vendor/fugue/cross-script.png"
                        text={noButtonText}
                        tooltip={noButtonText+" (ESC)"}
                        onClick={async () => w.close()}
                    />
                </FlexItem>
            </FlexHPanel>

        </Window>
    );

}

export async function getConfirmation(message: React.ReactNode, title: string = "Подтверждение", yesButtonText: string = "Да", noButtonText: string = "Нет") {
    return appState.desktop.openWindow(getGetConfirmationWindow(message, title, yesButtonText, noButtonText));
}
import * as  React from "react";
import * as  ReactDOM from "react-dom";
import {isFunction} from "util";


export async function openMenuPopup(event: MouseEvent, popup: React.ReactNode | ((rowItem: any) => Promise<React.ReactNode>), rowItem: any = null) {
    var elemDiv = document.createElement('div');
    $(elemDiv).addClass("buhta-popup-menu");
    document.body.appendChild(elemDiv);

    let scrollTop = $(window).scrollTop();
    let scrollLeft = $(window).scrollLeft();
    let left = event.clientX + 5 + scrollLeft!;
    let top = event.clientY + 5 + scrollTop!;

    if (isFunction(popup)) {
        ReactDOM.render(await (popup as any)(rowItem), elemDiv);
    }
    else {
        ReactDOM.render(popup as any, elemDiv);
    }

}
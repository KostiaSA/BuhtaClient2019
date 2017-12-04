import * as  React from "react";
import * as  ReactDOM from "react-dom";
import {isFunction} from "util";


export async function openMenuPopup(popup: React.ReactNode | ((rowItem: any) => Promise<React.ReactNode>), top: number, left: number, rowItem: any = null) {
    var elemDiv = document.createElement('div');
    $(elemDiv).addClass("buhta-popup-menu");
    document.body.appendChild(elemDiv);

    if (isFunction(popup)) {
        ReactDOM.render(await (popup as any)(rowItem), elemDiv);
    }
    else {
        ReactDOM.render(popup as any, elemDiv);
    }

}
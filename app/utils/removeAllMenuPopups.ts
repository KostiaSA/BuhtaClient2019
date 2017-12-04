import {getRandomString} from "./getRandomString";

export function removeAllMenuPopups(exceptDivId: string = "") {

    // в body удаляем div с классом buhta-popup-menu и еще 2 элемента
    let classToDelete = "del-" + getRandomString();
    let updateMode = -1;
    for (let div of $("body").children()) {
        if ($(div).hasClass("buhta-popup-menu") && (!$(div).children() || $(div).children().first().attr("id") !== exceptDivId))
            updateMode = 2;
        if (updateMode > -1) {
            $(div).addClass(classToDelete);
            updateMode--;
        }
    }
    $("." + classToDelete).remove();

}

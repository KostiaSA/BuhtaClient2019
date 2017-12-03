export function isMouseRightClickEvent(event: MouseEvent) {
    let result = false;
    if (event.which)
        result = (event.which === 3);
    else if (event.button)
        result = (event.button === 2);
    return result;
}
export function loadScript(jsCode: string) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.text = jsCode;
    document.head.appendChild(script);
}

import {appState} from "../AppState";
import {guidToHex} from "./guid";

let socket: WebSocket;
let socketAuthToken: string;

let socketState: string;

function updateState() {
    if (!socket) {
        socketState = "closed";
    } else {
        switch (socket.readyState) {
            case WebSocket.CLOSED:
                socketState = "closed";
                break;
            case WebSocket.CLOSING:
                socketState = "closing";
                break;
            case WebSocket.CONNECTING:
                socketState = "connecting";
                break;
            case WebSocket.OPEN:
                socketState = "open";
                break;
            default:
                socketState = "?";
                break;
        }
    }
    console.log("socket state -------------->", socketState);
}


export function webSocketInit() {
    if (appState.authToken === "none" || (socketAuthToken === appState.authToken && socket.readyState === WebSocket.OPEN))
        return;

    let scheme = document.location.protocol == "https:" ? "wss" : "ws";
    let port = document.location.port ? (":" + document.location.port) : "";
    let url = scheme + "://" + document.location.hostname + port + "/ws/" + guidToHex(appState.sessionId)+"/"+appState.windowId;

    socketAuthToken = appState.authToken;
    socket = new WebSocket(url);
    socket.onopen = function (event) {
        console.log("socket onopen -------------->", event);
        updateState();
    };
    socket.onclose = function (event) {
        console.log("socket onclose -------------->", event);
        updateState();
    };
    socket.onerror = function (event) {
        console.log("socket onerror -------------->", event);
        updateState();
    };
    socket.onmessage = function (event) {
        console.log("socket message==============>", event.data);
    };
}
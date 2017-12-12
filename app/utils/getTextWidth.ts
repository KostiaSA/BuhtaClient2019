
import {config} from "../config";

let canvas: any;

//  на основе https://stackoverflow.com/questions/31305071/measuring-text-width-height-without-rendering

export function getTextWidth(text: string, fontSize: number = config.font.size, fontStyle: string = config.font.style, fontFamily: number = config.font.family) {
    // re-use canvas object for better performance
    canvas = canvas || (canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = fontSize.toString() + "px " + fontStyle + " " + fontFamily;
    let metrics = context.measureText(text);
    return Math.round(metrics.width);
}

//console.log(getTextWidth("hello there!", "bold 12pt arial"));
declare var Babel: any;

export function babelTransform(script: string): string {
    return Babel.transform(script, {presets: ['es2016', 'react']}).code;
}
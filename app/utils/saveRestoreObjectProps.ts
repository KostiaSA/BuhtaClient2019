export type SavedObjectProp = { propName: string, value: any };

export function saveObjectProps(obj: any, excludeProps: string[] = []): SavedObjectProp[] {

    let ret: SavedObjectProp[]=[];

    for (let prop in obj) {
        if (excludeProps.indexOf(prop) >= 0 && obj.hasOwnProperty(prop)) {
            ret.push({ propName: prop, value: obj[prop] });
        }
    }

    return ret;

}

export function restoreObjectProps(obj: any, savedProps: SavedObjectProp[], excludeProps: string[] = []) {

    for (let savedProp of  savedProps) {
        if (excludeProps.indexOf(savedProp.propName) >= 0 && obj.hasOwnProperty(savedProp.propName)) {
            obj[savedProp.propName]=savedProp.value;
        }
    }

}

export function reassignObject(obj: any, newPropsObject: any, excludeProps: string[] = []) {

    for (let prop in obj) {
        if (excludeProps.indexOf(prop) === -1 && obj.hasOwnProperty(prop)) {
            delete obj[prop];
        }
    }

    for (let prop in newPropsObject) {
        if (excludeProps.indexOf(prop) === -1 && newPropsObject.hasOwnProperty(prop)) {
            obj[prop] = newPropsObject[prop];
        }
    }

}

export function assignObject(obj: any, newPropsObject: any, excludeProps: string[] = []) {

    for (let prop in newPropsObject) {
        if (excludeProps.indexOf(prop) === -1 && newPropsObject.hasOwnProperty(prop)) {
            obj[prop] = newPropsObject[prop];
        }
    }

}

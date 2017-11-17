export function reassignObject(obj: any, newPropsObject: any) {

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            delete obj[prop];
        }
    }

    for (let prop in newPropsObject) {
        if (newPropsObject.hasOwnProperty(prop)) {
            obj[prop]=newPropsObject[prop];
        }
    }

}

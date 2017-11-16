
export function omit(obj: any, fields: string[]) {
    const shallowCopy = {
        ...obj,
    };
    for (let i = 0; i < fields.length; i++) {
        const key = fields[i];
        delete shallowCopy[key];
    }
    return shallowCopy;
}


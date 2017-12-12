const uuidv4 = require('uuid/v4');

export function newGuid(): string {
    return uuidv4();
}
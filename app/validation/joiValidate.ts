import {SchemaLike, validate, ValidationError} from "joi";

export function joiValidate(value: any, validator: SchemaLike): ValidationError | null {

    let validationResult = validate(value, validator, {
        abortEarly: false,
        allowUnknown: false
    });

    if (validationResult.error) {

        let duplicates: any = {};
        validationResult.error.details = validationResult.error.details.filter((detail) => {
            if (duplicates[detail.message] || detail.type === "object.allowUnknown")
                return false;
            else {
                duplicates[detail.message] = true;
                return true;
            }
        });

        if (validationResult.error.details.length === 0)
            return null;
        else
            return validationResult.error;
    }
    else
        return null;

}
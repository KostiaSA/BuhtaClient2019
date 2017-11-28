import {IClassInfo} from "./IClassInfo";
import * as Joi from "joi";
import {joiRus} from "../i18n/joiRus";

export interface ISchemaObjectProps {
    id: string;
    name: string;
    className: string;
    description: string;
}

// export const SchemaObjectPropsValidator = Joi.object().keys({
//     id: Joi.string().min(10).max(20),
//     name: Joi.string().max(255),
//     className: Joi.string().max(255),
//     description: Joi.string().max(4096),
// });


export interface ISchemaObjectClassInfo<T> extends IClassInfo<T> {
    //designerUrl: string;
    title: string;
    description: string;
    designerPageId?: string;
    //editOptions?:ISchemaTableEditOptions;
}

export class SchemaObject<T extends ISchemaObjectProps> {
    props: T;

    constructor(props: T) {
        this.props = props || {};
    }


    getValidator(): Joi.ObjectSchema {

        return Joi.object().options({language: joiRus}).keys({
            id: Joi.string().min(10).max(20),
            name: Joi.string().max(12).required(),
            className: Joi.string().max(255),
            description: Joi.string().max(4096),
        })
    };

    validate(): Joi.ValidationResult<T> {
        return Joi.validate<T>(this.props, this.getValidator(), {abortEarly: false});
    }

//    static className = "platform-core:SchemaObject";
//    static designerUrl = "admin/schema-object-designer";

    async save() {
        // let classInfo = (this.constructor as any).classInfo as ISchemaObjectClassInfo<any>;
        // if (!classInfo) {
        //     let msg = "!constructor.classInfo";
        //     console.error(msg);
        //     throw msg + ", " + __filename;
        // }
        // this.props.className = classInfo.className;
        // return saveSchemaObjectApiRequest({object: this.props})
    }

    // async load(id: string) {
    //     this.props.id = id;
    //     // if (!this.props || !this.props.id)
    //     //     throw   "SchemaObject.load(): не заполнен props.id";
    //     this.props = (await loadSchemaObjectApiRequest({id: id})).object as any;
    // }

}



import * as Joi from "joi";
import {joiRus} from "../i18n/joiRus";
import {joiValidate} from "../validation/joiValidate";
import {appState} from "../AppState";
import {SchemaObjectBaseDesignerWindow} from "../admin/SchemaObjectBaseDesignerWindow";
import {Moment} from "moment";
import moment = require("moment");
import {throwError} from "../utils/throwError";

export interface ISchemaObjectProps {
    objectId?:string;
    objectType: string;
    name: string;
    description?: string;
    createdBy?: string;
    createdDate?: Moment;
    changedBy?: string;
    changedDate?: Moment;
    jsxFiles?: string[];
    sqlFiles?: string[];
}


export class SchemaObject<T extends ISchemaObjectProps=ISchemaObjectProps> {
    props: T;

    static objectType = "?Object";
    static objectTypeName = "?Объект";
    static icon = "";
    static designerWindow: typeof SchemaObjectBaseDesignerWindow;// = SchemaObjectBaseDesignerWindow;

    static getObjectTypeFromFileName(fileName: string): string {
        if (!fileName.endsWith(".json"))
            fileName += ".json";

        let words = fileName.split(".");
        if (words.length < 3) {
            let msg = "неверное имя файла объекта: '" + fileName + "'";
            throwError( msg);
        }
        words.pop();
        return words.pop()!;

    }

    constructor(props: T) {
        this.props = props || {};
    }


    getValidator(): Joi.ObjectSchema {

        return Joi.object().options({language: joiRus}).keys({
            objectType: Joi.string().required().only(appState.schemaObjectTypesAsArray.map((typ) => typ.objectType)).label("тип объекта"),
            name: Joi.string().required().max(127).required().label("имя объекта"),
            description: Joi.string().max(4096).label("описание"),
        })
    };

    validate(): Joi.ValidationError | null {
        return joiValidate(this.props, this.getValidator());
    }

    setChangedUserAndDate() {
        if (!this.props.createdBy)
            this.props.createdBy = appState.userId;
        if (!this.props.createdDate)
            this.props.createdDate = moment();
        this.props.changedBy = appState.userId;
        this.props.changedDate = moment();

    }

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



import {ISchemaObjectProps} from "./ISchemaObject";
//import {saveSchemaObjectApiRequest} from "./api/saveSchemaObjectApiRequest";
import {IClassInfo} from "./IClassInfo";
//import {ISchemaTableEditOptions} from "./table/ISchemaTableEditOptions";

export interface ISchemaObjectClassInfo<T> extends IClassInfo<T> {
    //designerUrl: string;
    title:string;
    description:string;
    designerPageId?: string;
    //editOptions?:ISchemaTableEditOptions;
}

export class SchemaObject<T extends ISchemaObjectProps> {
    props: T = {} as any;

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



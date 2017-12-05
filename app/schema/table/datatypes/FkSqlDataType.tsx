import * as React from "react";
import * as Joi from "joi";
import {BaseSqlDataType, IBaseSqlDataTypeProps} from "./BaseSqlDataType";
import {config} from "../../../const/config";
import {ComboBox} from "../../../ui/inputs/ComboBox";
import {ISchemaTree, loadSchemaTree} from "../../../admin/api/loadSchemaTree";
import {removeJsonExt} from "../../../utils/removeJsonExt";

export interface IFkSqlDataTypeProps extends IBaseSqlDataTypeProps {
    fkTableId?: string;
}

export class FkSqlDataType extends BaseSqlDataType<IFkSqlDataTypeProps> {

    public static id = "ForeignKey";

    getName(props?: IFkSqlDataTypeProps): string {
        if (!props)
            return "Ссылка";
        else {
            return this.getName() + "->" + props.fkTableId;
        }
    }

    getPropsNames(): string[] {
        return [...super.getPropsNames(), "fkTableId"];
    }

    setDefaultProps(props: IFkSqlDataTypeProps) {

    }

    getValidator(): Joi.ObjectSchema {
        return super.getValidator().keys({
            fkTableId: Joi.string().max(config.sql.maxIdentifierLength).label("FK таблица"),
        })
    };

    schemaTreeToFlatArray(tree: ISchemaTree, a: string[], path: string): string[] {
        if (tree.items) {
            for (let item of tree.items) {
                this.schemaTreeToFlatArray(item, a, path + "/" + tree.name);
            }
        }
        else {
            let table=(path + "/" + tree.name).replace("/root/", "");
            a.push(removeJsonExt(table));
        }
        return a;
    }

    renderPropsEditors(props: IFkSqlDataTypeProps): React.ReactNode {
        this.setDefaultProps(props);
        return (
            <ComboBox
                title="FK таблица"
                bindProp="dataType.fkTableId"
                placeHolder=""
                width={450}
                hidden={props.id !== FkSqlDataType.id}
                source={async () => this.schemaTreeToFlatArray(await loadSchemaTree(), [], "")}
            />
        )
    }


}
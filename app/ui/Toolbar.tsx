import * as  React from "react";
import {CSSProperties} from "react";
import {IComponentProps} from "./Component";
import {throwError} from "../utils/throwError";
import {isString} from "../utils/isString";
import {isArray} from "../utils/isArray";


export interface IToolbarItemProps {
    type?: "icon" | "button" | "divider";
    id?: string;
    group?: string;
    tooltip?: string;
    style?: CSSProperties
    width?: string | number;
    startGroup?: boolean;
}

export interface IToolbarIconItemProps extends IToolbarItemProps {
    icon?: string;
    onClick?: () => Promise<void>;
}

export interface IToolbarButtonItemProps extends IToolbarItemProps {
    title?: string;
    onClick?: () => Promise<void>;
}

export interface IToolbarProps extends IComponentProps {
    groups?: string[];
    items?: IToolbarItemProps[];
}

export function addToolbarIconItem(toolbar: IToolbarProps, item: IToolbarIconItemProps) {
    if (!toolbar || !isArray(toolbar.groups) || !isArray(toolbar.items))
        throwError("addToolbarIconItem(): не указан или неверный параметр 'toolbar'");

    if (!item)
        throwError("addToolbarIconItem(): не указан параметр 'item'");

    if (!isString(item.group))
        throwError("addToolbarIconItem(): не указан или неверный параметр 'item.group'");

    if (!isString(item.icon))
        throwError("addToolbarIconItem(): не указан или неверный параметр 'item.icon'");

    if (!isString(item.id))
        throwError("addToolbarIconItem(): не указан или неверный параметр 'item'");

    toolbar.items!.push(item);
}

export function removeToolbarItemsOfGroup(toolbar: IToolbarProps, group: string) {
    if (!toolbar || !isArray(toolbar.groups) || !isArray(toolbar.items))
        throwError("removeToolbarItemsOfGroup(): не указан или неверный параметр 'toolbar'");

    if (!isString(group))
        throwError("removeToolbarItemsOfGroup(): не указан или неверный параметр 'item'");

    toolbar.items = toolbar.items!.filter((_item) => _item.group !== group);

}

export class Toolbar extends React.Component<IToolbarProps> {


    renderItems(): React.ReactNode {
        let ret: React.ReactNode[] = [];
        let items = [...(this.props.items || []), ...React.Children.toArray(this.props)];
        let groups = this.props.groups || [];
        items.forEach((group: string) => {
            if (groups.indexOf(group) === -1)
                groups.push(group);
        });


        for (let group of groups) {
            for (let item of items.filter((_item: any) => _item.group === group || (_item.props && _item.props.group))) {
                let props: any = (item as any).props || item;
                if (props.type === "icon") {
                    ret.push(
                        <div key={props.id} className="buhta-toolbar-item"
                             style={{height: 25, width: 25}}
                        >
                            <img src={props.image} width={16} height={16}/>,
                        </div>
                    )
                }
            }
        }

        return ret;
    }

    render() {
        //console.log("render Div",this.props.children);
        return (
            <div style={{height: 25}}>
                {this.renderItems()}
            </div>

        )
    }

}
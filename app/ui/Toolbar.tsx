import * as  React from "react";
import {CSSProperties} from "react";
import {IComponentProps} from "./Component";
import {throwError} from "../utils/throwError";
import {isString} from "../utils/isString";
import {isArray} from "../utils/isArray";


const itemTypes = ["icon", "button", "divider"];

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

    if (itemTypes.indexOf(item.type as any) === -1)
        throwError("addToolbarIconItem(): не указан или неверный параметр 'item.type', может быть только '" + itemTypes.join("','") + "'");

    if (!isString(item.group))
        throwError("addToolbarIconItem(): не указан или неверный параметр 'item.group'");

    if (!isString(item.icon))
        throwError("addToolbarIconItem(): не указан или неверный параметр 'item.icon'");

    if (!isString(item.id))
        throwError("addToolbarIconItem(): не указан или неверный параметр 'item'");

    toolbar.items!.push(item);
}

export function clearToolbarGroup(toolbar: IToolbarProps, group: string) {
    if (!toolbar || !isArray(toolbar.groups) || !isArray(toolbar.items))
        throwError("removeToolbarItemsOfGroup(): не указан или неверный параметр 'toolbar'");

    if (!isString(group))
        throwError("removeToolbarItemsOfGroup(): не указан или неверный параметр 'item'");

    toolbar.items = toolbar.items!.filter((_item) => _item.group !== group);

}

export class Toolbar extends React.Component<IToolbarProps> {


    renderItems(): React.ReactNode {
        let ret: React.ReactNode[] = [];
        let items = [...(this.props.items || []), ...React.Children.toArray(this.props.children)];
        let groups = this.props.groups || [];
        items.forEach((group: string) => {
            if (groups.indexOf(group) === -1)
                groups.push(group);
        });

        let groupCount = 0;
        for (let group of groups) {
            let itemCount = 0;
            let groupItems = items.filter((_item: any) => _item.group === group || (_item.props && _item.props.group));
            if (groupCount > 0 && groupItems.length) {
                ret.push(
                    <div key={group + "-divider"}
                         style={{
                             position: "relative",
                             height: 16,
                             width: 1,
                             marginLeft: 4,
                             marginRight: 5,
                             display: "inline-block",
                             textAlign: "center",
                             borderRight: "1px solid silver",
                         }}
                    >
                    </div>
                )
            }

            for (let item of groupItems) {
                let props: any = (item as any).props || item;
                if (props.type === "icon") {


                    ret.push(
                        <div key={props.id} className="buhta-toolbar-item" title={props.tooltip}
                             style={{
                                 height: 22,
                                 width: 21,
                                 display: "inline-block",
                                 textAlign: "center",
                             }}
                        >
                            <img src={props.icon} width={16} height={16} style={{marginTop: 3}}/>
                        </div>
                    )
                }
                itemCount++;
            }
            if (groupItems.length > 0)
                groupCount++;
        }

        console.log("ret", ret)
        return ret;
    }

    render() {
        console.log("render Toolbar", this.props.children);
        return (
            <div style={{height: 23, borderBottom: "1px solid silver",}}>
                {this.renderItems()}
            </div>

        )
    }

}
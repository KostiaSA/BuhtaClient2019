import * as  React from "react";

export interface IEventArgs {
    sender: any;
}

export interface IEvent<TArgs extends IEventArgs> {
    (args: TArgs): void;
}

export interface IComponentRegistration {
    category: string;
    componentClass: Function;
    image?: string;
    title?: string;
}

export class Component<P> extends React.Component<P, any>{

    state:P;

    // --- $ ---
    //protected _$: JQuery;
    get $(): JQuery {
        let ret = $("#" + this.$id);
        if (ret.length > 0)
            return ret;
        else
            return null as any;
    }

    // set $(value: JQuery) {
    //     this._$ = value;
    // }

    private _$id: string;
    get $id(): string {
        if (!this._$id)
            this._$id = this.getRandomId();
        return this._$id;
    }

    private getRandomId(length: number = 20): string {
        return "a"+Math.random().toString(36).slice(2, length + 2);
    }
}
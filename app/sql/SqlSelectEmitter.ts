import {SqlEmitter} from "./SqlEmitter";

export class SqlSelectEmitter extends SqlEmitter{
    select: string[]=[];
    fields: string[]=[];
    from: string[]=[];
    where: string[]=[];

    toSql(): string {
        return [
            this.select.join("\n"),
            this.fields.join(",\n"),
            this.from.join("\n"),
            this.where.join("\n")
        ].join("\n");
    }

}

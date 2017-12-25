import {BaseSqlDataType} from "../schema/table/datatypes/BaseSqlDataType";

export class DbGridBaseFilter {
    filter(row: any): boolean {
        return true;
    }
}


export class DbGridEqualFilter {
    constructor(public dataType: BaseSqlDataType, public value: any, public columnName: string) {

    }

    filter(row: any): boolean {
        return this.dataType.isEquals(this.value, row[this.columnName]);
    }
}




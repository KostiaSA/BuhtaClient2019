class Test extends buhta.test.BaseTest {

    _executeSql(sql) {
        return buhta.admin.executeSql("testmssql", sql);
    }

    _getDialect() {
        return "mssql";
    }

    _getSchemaTable() {
        let props = {
            name: "__testtable__",
            objectType: "table",
            columns: [
                {
                    name: "Ключ",
                    primaryKey: true,
                    dataType: {
                        id: "Integer",
                        size: "32"
                    },
                },
                {
                    name: "string500",
                    dataType: {
                        id: "String",
                        maxLen: "500"
                    },
                },
                {
                    name: "int_8_min",
                    dataType: {
                        id: "Integer",
                        size: "8"
                    },
                },

            ]
        };
        return new buhta.schema.SchemaTable(props);
    }

    // async _before(){
    //     throw "не рабо бефо 6786";
    //     //return "аqweeqwга!"
    // }

    async create_table() {
        let sql = this._getSchemaTable().emitCreateTableSql(this._getDialect());
        this._executeSql(sql);
    }

    // async test10000() {
    //     let res=await buhta.admin.executeSql("testmssql","select top 10000 * from ТМЦ");
    //     return "ok"
    // }
    //
    // async test20000() {
    //     let res=await buhta.admin.executeSql("testmssql","select top 20000 * from ТМЦ");
    //     return "ok"
    // }
    //
    // async test80000() {
    //     let res=await buhta.admin.executeSql("testmssql","select top 80000 номер,название from ТМЦ");
    //     return "ok"
    // }

    // async test2() {
    //     throw "ошибка 6786";
    // }
    //
    // async _after(){
    //     return "аqweeqwга!"
    // }
}
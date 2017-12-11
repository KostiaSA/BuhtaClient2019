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
                    name: "id",
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
                    name: "int8",
                    dataType: {
                        id: "Integer",
                        size: "8"
                    },
                },

            ]
        };
        return new buhta.schema.SchemaTable(props);
    }

    _getMinRow() {
        return {
            id: -1,
            string500: "",
            int8: CONST.MIN_INT8,

        }
    }

    _getMaxRow() {
        return {
            id: 1,
            string500: "Я".repeat(500),
            int8: CONST.MAX_INT8,
        }
    }

    async create_table() {
        let sql = this._getSchemaTable().emitCreateTableSql(this._getDialect());
        await this._executeSql(sql);
    }

    async insert_row_with_min_values() {
        let sql = this._getSchemaTable().emitInsertRowSql(this._getDialect(), this._getMinRow());
        await this._executeSql(sql);
    }

    async insert_row_with_max_values() {
        let sql = this._getSchemaTable().emitInsertRowSql(this._getDialect(), this._getMaxRow());
        await this._executeSql(sql);
    }

    async drop_table() {
        let sql = this._getSchemaTable().emitDropTableSql(this._getDialect());
        await this._executeSql(sql);
    }
}
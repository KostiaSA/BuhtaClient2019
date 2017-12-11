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
                {
                    name: "uint8",
                    dataType: {
                        id: "Integer",
                        size: "8",
                        unsigned: true
                    },
                },
                {
                    name: "int16",
                    dataType: {
                        id: "Integer",
                        size: "16"
                    },
                },
                {
                    name: "uint16",
                    dataType: {
                        id: "Integer",
                        size: "16",
                        unsigned: true
                    },
                },
                {
                    name: "int32",
                    dataType: {
                        id: "Integer",
                        size: "32"
                    },
                },
                {
                    name: "uint32",
                    dataType: {
                        id: "Integer",
                        size: "32",
                        unsigned: true
                    },
                },
                {
                    name: "int64",
                    dataType: {
                        id: "Integer",
                        size: "64"
                    },
                },
                {
                    name: "uint64",
                    dataType: {
                        id: "Integer",
                        size: "64",
                        unsigned: true
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
            uint8: 0,
            int16: CONST.MIN_INT16,
            uint16: 0,
            int32: CONST.MIN_INT32,
            uint32: 0,
            int64: CONST.MIN_SAFE_INTEGER_FLOAT64,
            uint64: 0,

        }
    }

    _getMaxRow() {
        return {
            id: 1,
            string500: "Я".repeat(500),
            int8: CONST.MAX_INT8,
            uint8: CONST.MAX_UINT8,
            int16: CONST.MAX_INT16,
            uint16: CONST.MAX_UINT16,
            int32: CONST.MAX_INT32,
            uint32: CONST.MAX_UINT32,
            int64: CONST.MAX_SAFE_INTEGER_FLOAT64,
            uint64: CONST.MAX_SAFE_INTEGER_FLOAT64,
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

    async select_row_with_min_values() {
        let sql = this._getSchemaTable().emitSelectRowSql(this._getDialect(), this._getMinRow().id);
        let res = await this._executeSql(sql);
        assert.equal(res[0].rows.length, 1);
        let row = res[0].rows[0];
        assert.deepEqual(row, this._getMinRow());
    }

    async select_row_with_max_values() {
        let sql = this._getSchemaTable().emitSelectRowSql(this._getDialect(), this._getMaxRow().id);
        let res = await this._executeSql(sql);
        assert.equal(res[0].rows.length, 1);
        let row = res[0].rows[0];
        assert.deepEqual(row, this._getMaxRow());
    }

    async drop_table() {
        let sql = this._getSchemaTable().emitDropTableSql(this._getDialect());
        await this._executeSql(sql);
    }
}
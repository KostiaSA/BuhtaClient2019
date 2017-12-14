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
                    name: "string4000",
                    dataType: {
                        id: "String",
                        maxLen: "4000"
                    },
                },
                {
                    name: "stringMax",
                    dataType: {
                        id: "String",
                        maxLen: 0
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
                {
                    name: "guid",
                    dataType: {
                        id: "Guid"
                    },
                },
                {
                    name: "money",
                    dataType: {
                        id: "Money"
                    },
                },
                {
                    name: "decimal_16_1",
                    dataType: {
                        id: "Decimal",
                        scale: "16,1"
                    },
                },
                {
                    name: "decimal_16_2",
                    dataType: {
                        id: "Decimal",
                        scale: "16,2"
                    },
                },
                {
                    name: "decimal_16_3",
                    dataType: {
                        id: "Decimal",
                        scale: "16,3"
                    },
                },
                {
                    name: "decimal_16_4",
                    dataType: {
                        id: "Decimal",
                        scale: "16,4"
                    },
                },
                {
                    name: "decimal_16_5",
                    dataType: {
                        id: "Decimal",
                        scale: "16,5"
                    },
                },
                {
                    name: "decimal_16_6",
                    dataType: {
                        id: "Decimal",
                        scale: "16,6"
                    },
                },
                {
                    name: "decimal_16_7",
                    dataType: {
                        id: "Decimal",
                        scale: "16,7"
                    },
                },
                {
                    name: "decimal_16_8",
                    dataType: {
                        id: "Decimal",
                        scale: "16,8"
                    },
                },
                {
                    name: "decimal_16_9",
                    dataType: {
                        id: "Decimal",
                        scale: "16,9"
                    },
                },
                {
                    name: "decimal_16_10",
                    dataType: {
                        id: "Decimal",
                        scale: "16,10"
                    },
                },
                {
                    name: "decimal_16_11",
                    dataType: {
                        id: "Decimal",
                        scale: "16,11"
                    },
                },
                {
                    name: "decimal_16_12",
                    dataType: {
                        id: "Decimal",
                        scale: "16,12"
                    },
                },
                {
                    name: "decimal_16_13",
                    dataType: {
                        id: "Decimal",
                        scale: "16,13"
                    },
                },
                {
                    name: "decimal_16_14",
                    dataType: {
                        id: "Decimal",
                        scale: "16,14"
                    },
                },
                {
                    name: "decimal_9_1",
                    dataType: {
                        id: "Decimal",
                        scale: "9,1"
                    },
                },
                {
                    name: "decimal_9_2",
                    dataType: {
                        id: "Decimal",
                        scale: "9,2"
                    },
                },
                {
                    name: "decimal_9_3",
                    dataType: {
                        id: "Decimal",
                        scale: "9,3"
                    },
                },
                {
                    name: "decimal_9_4",
                    dataType: {
                        id: "Decimal",
                        scale: "9,4"
                    },
                },
                {
                    name: "decimal_9_5",
                    dataType: {
                        id: "Decimal",
                        scale: "9,5"
                    },
                },
                {
                    name: "decimal_9_6",
                    dataType: {
                        id: "Decimal",
                        scale: "9,6"
                    },
                },
                {
                    name: "decimal_9_7",
                    dataType: {
                        id: "Decimal",
                        scale: "9,7"
                    },
                },
                {
                    name: "date",
                    dataType: {
                        id: "Date",
                    },
                },
                {
                    name: "dateTime",
                    dataType: {
                        id: "DateTime",
                    },
                },
                {
                    name: "blob",
                    dataType: {
                        id: "Blob",
                    },
                },
                {
                    name: "boolean",
                    dataType: {
                        id: "Boolean",
                    },
                },
                {
                    name: "fk1",
                    dataType: {
                        "id": "ForeignKey",
                        "fkTableId": "buhta/core-tests/sql/Тестовый_справочник_1.table"
                    }
                },

            ]
        };
        return new buhta.schema.SchemaTable(props);
    }

    _getMinRow() {
        return {
            id: -1,
            string4000: "",
            stringMax: "",
            int8: CONST.MIN_INT8,
            uint8: 0,
            int16: CONST.MIN_INT16,
            uint16: 0,
            int32: CONST.MIN_INT32,
            uint32: 0,
            int64: CONST.MIN_SAFE_INTEGER_FLOAT64,
            uint64: 0,
            guid: "00000000-0000-0000-0000-000000000000",
            money: buhta.config.sql.minMoneyValue,
            decimal_16_1: -buhta.config.sql.maxDecimal["16,1"],
            decimal_16_2: -buhta.config.sql.maxDecimal["16,2"],
            decimal_16_3: -buhta.config.sql.maxDecimal["16,3"],
            decimal_16_4: -buhta.config.sql.maxDecimal["16,4"],
            decimal_16_5: -buhta.config.sql.maxDecimal["16,5"],
            decimal_16_6: -buhta.config.sql.maxDecimal["16,6"],
            decimal_16_7: -buhta.config.sql.maxDecimal["16,7"],
            decimal_16_8: -buhta.config.sql.maxDecimal["16,8"],
            decimal_16_9: -buhta.config.sql.maxDecimal["16,9"],
            decimal_16_10: -buhta.config.sql.maxDecimal["16,10"],
            decimal_16_11: -buhta.config.sql.maxDecimal["16,11"],
            decimal_16_12: -buhta.config.sql.maxDecimal["16,12"],
            decimal_16_13: -buhta.config.sql.maxDecimal["16,13"],
            decimal_16_14: -buhta.config.sql.maxDecimal["16,14"],
            decimal_9_1: -buhta.config.sql.maxDecimal["9,1"],
            decimal_9_2: -buhta.config.sql.maxDecimal["9,2"],
            decimal_9_3: -buhta.config.sql.maxDecimal["9,3"],
            decimal_9_4: -buhta.config.sql.maxDecimal["9,4"],
            decimal_9_5: -buhta.config.sql.maxDecimal["9,5"],
            decimal_9_6: -buhta.config.sql.maxDecimal["9,6"],
            decimal_9_7: -buhta.config.sql.maxDecimal["9,7"],
            date: buhta.config.sql.minDate,
            dateTime: buhta.config.sql.minDateTime,
            blob: new Uint8Array(0).buffer,
            boolean:false,
            fk1:CONST.MIN_INT32,
        }
    }

    _getNullRow() {
        return {
            id: 0,
            string4000: null,
            stringMax: null,
            int8: null,
            uint8: null,
            int16: null,
            uint16: null,
            int32: null,
            uint32: null,
            int64: null,
            uint64: null,
            guid: null,
            money: null,
            decimal_16_1: null,
            decimal_16_2: null,
            decimal_16_3: null,
            decimal_16_4: null,
            decimal_16_5: null,
            decimal_16_6: null,
            decimal_16_7: null,
            decimal_16_8: null,
            decimal_16_9: null,
            decimal_16_10: null,
            decimal_16_11: null,
            decimal_16_12: null,
            decimal_16_13: null,
            decimal_16_14: null,
            decimal_9_1: null,
            decimal_9_2: null,
            decimal_9_3: null,
            decimal_9_4: null,
            decimal_9_5: null,
            decimal_9_6: null,
            decimal_9_7: null,
            date: null,
            dateTime: null,
            blob: null,
            boolean:null,
            fk1:null,
        }
    }

    _getMaxRow() {
        if (!this.blob_array) {
            this.blob_array = new Uint8Array(1000000);
            for (let i = 0; i < 1000000; i++)
                this.blob_array[i] = i % 256;
        }

        return {
            id: 1,
            string4000: "Я".repeat(4000),
            stringMax: "Ямай首頁>所有分類ка1238".repeat(100000),
            int8: CONST.MAX_INT8,
            uint8: CONST.MAX_UINT8,
            int16: CONST.MAX_INT16,
            uint16: CONST.MAX_UINT16,
            int32: CONST.MAX_INT32,
            uint32: CONST.MAX_UINT32,
            int64: CONST.MAX_SAFE_INTEGER_FLOAT64,
            uint64: CONST.MAX_SAFE_INTEGER_FLOAT64,
            guid: "ffffffff-ffff-ffff-ffff-ffffffffffff",
            money: buhta.config.sql.maxMoneyValue,
            decimal_16_1: buhta.config.sql.maxDecimal["16,1"],
            decimal_16_2: buhta.config.sql.maxDecimal["16,2"],
            decimal_16_3: buhta.config.sql.maxDecimal["16,3"],
            decimal_16_4: buhta.config.sql.maxDecimal["16,4"],
            decimal_16_5: buhta.config.sql.maxDecimal["16,5"],
            decimal_16_6: buhta.config.sql.maxDecimal["16,6"],
            decimal_16_7: buhta.config.sql.maxDecimal["16,7"],
            decimal_16_8: buhta.config.sql.maxDecimal["16,8"],
            decimal_16_9: buhta.config.sql.maxDecimal["16,9"],
            decimal_16_10: buhta.config.sql.maxDecimal["16,10"],
            decimal_16_11: buhta.config.sql.maxDecimal["16,11"],
            decimal_16_12: buhta.config.sql.maxDecimal["16,12"],
            decimal_16_13: buhta.config.sql.maxDecimal["16,13"],
            decimal_16_14: buhta.config.sql.maxDecimal["16,14"],
            decimal_9_1: buhta.config.sql.maxDecimal["9,1"],
            decimal_9_2: buhta.config.sql.maxDecimal["9,2"],
            decimal_9_3: buhta.config.sql.maxDecimal["9,3"],
            decimal_9_4: buhta.config.sql.maxDecimal["9,4"],
            decimal_9_5: buhta.config.sql.maxDecimal["9,5"],
            decimal_9_6: buhta.config.sql.maxDecimal["9,6"],
            decimal_9_7: buhta.config.sql.maxDecimal["9,7"],
            date: buhta.config.sql.maxDate,
            dateTime: buhta.config.sql.maxDateTime,
            blob: this.blob_array.buffer,
            boolean:true,
            fk1:CONST.MAX_INT32,
        }
    }

    async create_table() {
        let sql = await  this._getSchemaTable().emitCreateTableSql(this._getDialect());
        await this._executeSql(sql);
    }

    async insert_row_with_min_values() {
        let sql = await  this._getSchemaTable().emitInsertRowSql(this._getDialect(), this._getMinRow());
        await this._executeSql(sql);
    }

    async insert_row_with_null_values() {
        let sql = await  this._getSchemaTable().emitInsertRowSql(this._getDialect(), this._getNullRow());
        await this._executeSql(sql);
    }

    async insert_row_with_max_values() {
        let sql = await  this._getSchemaTable().emitInsertRowSql(this._getDialect(), this._getMaxRow());
        await this._executeSql(sql);
    }

    async select_row_with_min_values() {
        let sql = await  this._getSchemaTable().emitSelectRowSql(this._getDialect(), this._getMinRow().id);
        let res = await this._executeSql(sql);
        assert.equal(res[0].rows.length, 1);
        let row = res[0].rows[0];
        assert.deepEqual(row, this._getMinRow());
    }

    async select_row_with_null_values() {
        let sql = await  this._getSchemaTable().emitSelectRowSql(this._getDialect(), this._getNullRow().id);
        let res = await this._executeSql(sql);
        assert.equal(res[0].rows.length, 1);
        let row = res[0].rows[0];
        assert.deepEqual(row, this._getNullRow());
    }

    async select_row_with_max_values() {
        let sql = await  this._getSchemaTable().emitSelectRowSql(this._getDialect(), this._getMaxRow().id);
        let res = await this._executeSql(sql);
        assert.equal(res[0].rows.length, 1);
        let row = res[0].rows[0];
        assert.deepEqual(row, this._getMaxRow());
    }

    async update_max_row() {
        let newRow = this._getMaxRow();
        newRow.string4000 = null;
        newRow.int16 = null;
        newRow.int32 = -508983;
        let sql = await  this._getSchemaTable().emitUpdateRowSql(this._getDialect(), newRow);
        await this._executeSql(sql);

        sql = await this._getSchemaTable().emitSelectRowSql(this._getDialect(), newRow.id);
        let res = await this._executeSql(sql);
        assert.equal(res[0].rows.length, 1);
        let row = res[0].rows[0];
        assert.deepEqual(row, newRow);
    }

    async delete_max_row() {
        let newRow = this._getMaxRow();
        let sql = await  this._getSchemaTable().emitDeleteRowSql(this._getDialect(), newRow.id);
        await this._executeSql(sql);

        sql = await this._getSchemaTable().emitSelectRowSql(this._getDialect(), newRow.id);
        let res = await this._executeSql(sql);
        assert.equal(res[0].rows.length, 0);

        sql = await this._getSchemaTable().emitSelectRowSql(this._getDialect(), this._getMinRow().id);
        res = await this._executeSql(sql);
        assert.equal(res[0].rows.length, 1);

        sql = await this._getSchemaTable().emitSelectRowSql(this._getDialect(), this._getNullRow().id);
        res = await this._executeSql(sql);
        assert.equal(res[0].rows.length, 1);
    }

    async drop_table() {
        let sql = await  this._getSchemaTable().emitDropTableSql(this._getDialect());
        await this._executeSql(sql);
    }
}
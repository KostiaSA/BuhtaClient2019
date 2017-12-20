class Test extends buhta.test.BaseTest {

    async mssql() {
        let paramsObj = {
            value1: "строка777",
            value2: -1,
            value3: moment(),

        };

        let res = await buhta.sql.executeSql("buhta/core-tests/sql/executeSql_1.test", paramsObj, "testmssql");
        console.log(res[0].rows);

        assert.equal(res[0].rows[0].value1, paramsObj.value1);
        assert.equal(res[1].rows[0].value1, paramsObj.value2);
        assert.equal(res[2].rows[0].value1.toString(), paramsObj.value3.toString());

    }

    async mysql() {
        let paramsObj = {
            value1: "строка777",
            value2: -1,
            value3: moment(),

        };

        let res = await buhta.sql.executeSql("buhta/core-tests/sql/executeSql_1.test", paramsObj, "testmysql");
        console.log(res[0].rows);

        assert.equal(res[0].rows[0].value1, paramsObj.value1);
        assert.equal(res[1].rows[0].value1, paramsObj.value2);
        assert.equal(res[2].rows[0].value1.toString(), paramsObj.value3.toString());

    }

    async postgres() {
        let paramsObj = {
            value1: "строка777",
            value2: -1,
            value3: moment(),

        };

        let res = await buhta.sql.executeSql("buhta/core-tests/sql/executeSql_1.test", paramsObj, "testpostgres");
        console.log(res[0].rows);

        assert.equal(res[0].rows[0].value1, paramsObj.value1);
        assert.equal(res[1].rows[0].value1, paramsObj.value2);
        assert.equal(res[2].rows[0].value1.toString(), paramsObj.value3.toString());

    }


}
class Test extends buhta.test.BaseTest {

    async mssql() {
        let paramsObj = {
            value1: "строка777"
        };

        let res = await buhta.sql.executeSql("buhta/core-tests/sql/executeSql_1.test", paramsObj, "testmssql");
        console.log(res[0].rows);

        assert.equal(res[0].rows[0].value1, paramsObj.value1);

    }


}
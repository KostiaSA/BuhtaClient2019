
class Test extends buhta.test.BaseTest {

    // сделано для прописывания в исходниках BuhtaServer (инициализация новой базы данных)
    async create() {
        //assert.isTrue(false,"временно отключен");
        let sessionTableProps=await buhta.schema.getSchemaObjectProps("buhta/auth/Session.table");
        let sessionTable=new buhta.schema.SchemaTable(sessionTableProps);
        let row={
            userId:buhta.util.guidFromHex("83483ab8-a374-48e0-9b36-cc42dac923e9"),
            login:"admin",
            password:"password",
            isAdmin:true
        };
        console.log(await sessionTable.emitCreateTableSql("mssql"));

        console.log(await sessionTable.emitCreateTableSql("mysql"));
        console.log(await sessionTable.emitCreateTableSql("postgres"));

        let userTableProps=await buhta.schema.getSchemaObjectProps("buhta/auth/User.table");
        let userTable=new buhta.schema.SchemaTable(userTableProps);

        console.log(await userTable.emitCreateTableSql("mssql"));
        console.log(await userTable.emitInsertRowSql("mssql",row));

        console.log(await userTable.emitCreateTableSql("mysql"));
        console.log(await userTable.emitInsertRowSql("mysql",row));

        console.log(await userTable.emitCreateTableSql("postgres"));
        console.log(await userTable.emitInsertRowSql("postgres",row));


    }


}
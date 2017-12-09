

class Test extends buhta.test.BaseTest {

    _localProc(){
        return "ага!"
    }

    // async _before(){
    //     throw "не рабо бефо 6786";
    //     //return "аqweeqwга!"
    // }

    async test1() {
        let res=await buhta.admin.executeSql("mag3666","select top 20000 * from ТМЦ");
        debugger
        return "ok"
    }

    // async test2() {
    //     throw "ошибка 6786";
    // }
    //
    // async _after(){
    //     return "аqweeqwга!"
    // }
}
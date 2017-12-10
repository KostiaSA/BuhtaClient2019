

class Test extends buhta.test.BaseTest {

    _localProc(){
        return "ага!"
    }

    // async _before(){
    //     throw "не рабо бефо 6786";
    //     //return "аqweeqwга!"
    // }

    async test10000() {
        let res=await buhta.admin.executeSql("mag3666","select top 10000 * from ТМЦ");
        return "ok"
    }

    async test20000() {
        let res=await buhta.admin.executeSql("mag3666","select top 20000 * from ТМЦ");
        return "ok"
    }

    async test80000() {
        let res=await buhta.admin.executeSql("mag3666","select top 80000 номер,название from ТМЦ");
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
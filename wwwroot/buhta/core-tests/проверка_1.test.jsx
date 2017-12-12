

class Test extends buhta.test.BaseTest {

    _localProc(){
        return "ага!"
    }

    async test1() {
        return "ok"
    }

    async test2() {
        throw "ошибка ужасная 6786";
    }

}
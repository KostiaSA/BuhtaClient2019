

class Test extends buhta.test.BaseTest {

    _localProc(){
        return "ага!"
    }

    async _before(){
        return "аqweeqwга!"
    }

    async test1() {
        return "ok"
    }

    async test2() {
        throw "ошибка 6786";
    }

    async _after(){
        return "аqweeqwга!"
    }
}
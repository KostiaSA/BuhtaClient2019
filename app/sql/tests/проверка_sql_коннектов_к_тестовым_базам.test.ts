import {BaseTest} from "../../test/BaseTest";

export class Test extends BaseTest {
    async test1() {
        return "ok"
    }

    async test2() {
        throw "";
    }

}
class Test extends buhta.test.BaseTest {

    async arrayBufferToBase64() {
        let str = "ТестБаза64-TestBase64";
        let base64 = "0KLQtdGB0YLQkdCw0LfQsDY0LVRlc3RCYXNlNjQ=";
        assert(buhta.util.arrayBufferToBase64((new TextEncoder().encode(str)).buffer) === base64, "ошибка кодирования");

    }

    async base64ToArrayBuffer() {
        let base64 = "0KLQtdGB0YLQkdCw0LfQsDY0LVRlc3RCYXNlNjQ=";
        assert(buhta.util.arrayBufferToBase64(buhta.util.base64ToArrayBuffer(base64)) === base64, "ошибка кодирования");
    }


    async BJSON() {
        let base64 = "0KLQtdGB0YLQkdCw0LfQsDY0LVRlc3RCYXNlNjQ=";
        let obj = {
            str: "https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string\"\\",
            str2: "<https://stackoverflow.com",
            arrayBuffer: buhta.util.base64ToArrayBuffer(base64),
            uint8Array: new Uint8Array(buhta.util.base64ToArrayBuffer(base64)),


            ara: [1, {o: "ooo"}, true],
            //date:moment([2018,11,1]),
            //bin:buhta.util.base64ToArrayBuffer(base64),
            //uint8array:new Uint8Array(buhta.util.base64ToArrayBuffer(base64))
        };

        let a_json = buhta.util.BJSON_stringify(obj);
        console.log("bjson======================================================2222222=", a_json);

        let clone = buhta.util.BJSON_parse(a_json);

        // console.log("cloned=====================================================",c);
        // console.log(btoa(a.uint8array),btoa(c.uint8array),"error on 'Uint8array'");
        //
        assert(obj.str === clone.str, "error on 'String'");
        assert(obj.str2 === clone.str2, "error on 'String' 2");
        assert(btoa(obj.arrayBuffer) === btoa(clone.arrayBuffer), "error on 'ArrayBuffer'");
        assert(btoa(obj.uint8Array) === btoa(clone.uint8Array), "error on 'Uint8Array'");


    }


}
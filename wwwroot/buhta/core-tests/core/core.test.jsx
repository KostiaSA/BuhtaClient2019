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


    async XJSON() {
        let base64 = "0KLQtdGB0YLQkdCw0LfQsDY0LVRlc3RCYXNlNjQ=";
        let obj = {
            str: "https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string\"\\",
            str2: "<Date>???",
            arrayBuffer: buhta.util.base64ToArrayBuffer(base64),
            uint8Array: new Uint8Array(buhta.util.base64ToArrayBuffer(base64)),

            date1: moment("0001-12-13 16:25:13.023"),
            date2: moment("5217-12-13 16:44:58.049"),
            date3: moment("2017-11-30"),
            time0: moment("0000-01-01 14:56:12.123"),
            time1: moment("0000-01-01 14:56:12.3"),
            time2: moment("0000-01-01 14:56:12"),
            time3: moment("0000-01-01 14:56"),
            array1: [1, {o: "ooo", a876: ["<<<23>>>", 45]}, true, false, [34, 45]],
        };

        let a_json = buhta.util.XJSON_stringify(obj);

        let clone = buhta.util.XJSON_parse(a_json);

        assert(obj.str === clone.str, "error on 'String' 1");
        assert(obj.str2 === clone.str2, "error on 'String' 2");
        assert(btoa(obj.arrayBuffer) === btoa(clone.arrayBuffer), "error on 'ArrayBuffer'");
        assert(btoa(obj.uint8Array) === btoa(clone.uint8Array), "error on 'Uint8Array'");
        assert(obj.date1.isSame(clone.date1), "error on 'Date/Moment' 1");
        assert(obj.date2.isSame(clone.date2), "error on 'Date/Moment' 2");
        assert(obj.date3.isSame(clone.date3), "error on 'Date/Moment' 3");
        assert(JSON.stringify(obj.array1) === JSON.stringify(clone.array1), "error on array");
        assert(obj.time0.isSame(clone.time0), "error on 'Time' 0");
        assert(obj.time1.isSame(clone.time1), "error on 'Time' 1");
        assert(obj.time2.isSame(clone.time2), "error on 'Time' 2");
        assert(obj.time3.isSame(clone.time3), "error on 'Time' 3");

    }


}
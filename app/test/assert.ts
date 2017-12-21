declare const chai: any;

// chai напрямую в тестах не вызываем
// вызов здесь console.error(error) дает правильный переход к месту ошибки в Chrome

export let assert: any = {};

for (let method_name in chai.assert) {
    assert[method_name] = (...p: any[]) => {
        try {
            chai.assert[method_name](...p);
        }
        catch (error) {
            console.error("<-- здесь смотри call stack по ошибке, которая ниже");
            throw error;
        }
    }
}


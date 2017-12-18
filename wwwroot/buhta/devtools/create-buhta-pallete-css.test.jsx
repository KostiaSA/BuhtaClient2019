class Test extends buhta.test.BaseTest {

    async create() {
        let text = [];
        text.push("/* этот файл сгенерирован автоматически, не меняйте его*/");
        for (let color of buhta.config.CSS_COLOR_NAMES) {
            color=color.toLowerCase();
            text.push(".color-" + color + " {\n    color:" + color + "\n}\n");
            text.push(".background-" + color + " {\n    background:" + color + "\n}\n");
        }
        let file = text.join("\n");
        buhta.util.downloadStringAsFile("buhta-pallete.css",file);
    }


}
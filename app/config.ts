import * as moment from "moment";

export let config: any = {
    theme: "buhta",
    border: "1px solid #d4d4d4",
    font: {
        family: "Ubuntu",
        style: "normal",
        size: 13

    },
    comboBox: {
        itemHeight: 20,
    },
    formPanel: {
        inputVerticalSpace: 3,

        errorMessageColor: "tomato",
        errorMessageFontSize: 12,
        errorMessageFontStyle: "italic",
        errorInputBackground: "rgb(255, 241, 239)",
        errorMessageMaxLength: 50,

        inputDefaultColor: "black",
        inputChangedColor: "#108ee9",
        //inputChangedBackground: "#eaf6ffc7",

        labelColor: "cadetblue",
    },
    button: {
        okIcon: "vendor/fugue/tick.png",
        saveIcon: "vendor/fugue/disk.png",
        cancelIcon: "vendor/fugue/cross-script.png",
        insertRowIcon: "vendor/fugue/plus.png",
        changeRowIcon: "vendor/fugue/card--pencil.png",
        deleteRowIcon: "vendor/fugue/cross.png",
        focusedBorder: "1px solid dodgerblue",
    },
    baseInput: {
        height: 24,
        width: 300,
    },
    numberInput: {
        decimalSeparator: ".",
        digits: 12,
        groupSeparator: " ",
        width: 150,
        negativeColor: "red"
    },
    sql: {
        maxIdentifierLength: 127,
        maxStringLength: 4096,
        maxColumnsInTable: 4096,
        maxMoneyValue: 69999999999999.99,
        minMoneyValue: -69999999999999.99,
        maxDecimal: {
            "9,1": 99999999.9,
            "9,2": 9999999.99,
            "9,3": 999999.999,
            "9,4": 99999.9999,
            "9,5": 9999.99999,
            "9,6": 999.999999,
            "9,7": 99.9999999,
            "16,1": 699999999999999.9,
            "16,2": 69999999999999.99,
            "16,3": 6999999999999.999,
            "16,4": 699999999999.9999,
            "16,5": 69999999999.99999,
            "16,6": 6999999999.999999,
            "16,7": 699999999.9999999,
            "16,8": 69999999.99999999,
            "16,9": 6999999.999999999,
            "16,10": 699999.9999999999,
            "16,11": 69999.99999999999,
            "16,12": 6999.999999999999,
            "16,13": 699.9999999999999,
            "16,14": 69.99999999999999,
        },
        minDate: moment("0001-01-02"),
        maxDate: moment("9999-12-31")

    },
    grid: {
        rowsHeight: 22
    }
};
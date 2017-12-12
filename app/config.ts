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
        minMoneyValue: -69999999999999.99
    },
    grid: {
        rowsHeight: 22
    }
};
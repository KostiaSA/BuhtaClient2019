export let config: any = {
    font: {
        family: "Ubuntu",
        style: "normal",
        size: 13

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
    }
};
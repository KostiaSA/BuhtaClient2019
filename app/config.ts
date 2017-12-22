import * as moment from "moment";

export let config: any = {
        productionMode: false,
        adminMode: true,
        theme: "buhta",
        border: "1px solid #d4d4d4",
        mainDatabaseName: "main",
        font: {
            family: "Ubuntu",
            style: "normal",
            size: 13

        },
        comboBox: {
            itemHeight: 20,
        },
        formPanel: {
            inputVerticalSpace: 5,

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
            applyIcon: "vendor/fugue/disks-black.png",
            cancelIcon: "vendor/fugue/cross-script.png",
            insertRowIcon: "vendor/fugue/plus.png",
            changeRowIcon: "vendor/fugue/card--pencil.png",
            deleteRowIcon: "vendor/fugue/cross.png",
            focusedBorder: "1px solid dodgerblue",
            refreshIcon: "vendor/fugue/arrow-circle-double-green.png",
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
            maxDate: moment("9999-12-31"),
            minDateTime: moment("0001-01-02 00:00:00.001"),
            maxDateTime: moment("9999-12-31 23:59:59.999"),

            fkDataTypeColor: "darkcyan",
            blobDataTypeColor: "olive",
            booleanDataTypeColor: "tomato",
            dateDataTypeColor: "royalblue",
            dateTimeDataTypeColor: "royalblue",
            decimalDataTypeColor: "black",
            integerDataTypeColor: "black",
            moneyDataTypeColor: "forestgreen",
            guidDataTypeColor: "darkorange",
            stringDataTypeColor: "brown",

        },
        grid: {
            rowsHeight: 21
        },
        CSS_COLOR_NAMES: [
            "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond",
            "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral",
            "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray",
            "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid",
            "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey",
            "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick",
            "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey",
            "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender",
            "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow",
            "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue",
            "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen",
            "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen",
            "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream",
            "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed",
            "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff",
            "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon",
            "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey",
            "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat",
            "White", "WhiteSmoke", "Yellow", "YellowGreen"]

    }
;
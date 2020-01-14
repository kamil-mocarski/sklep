const presets = [
    [
        "@babel/env",
        {
            corejs: "3.0.0",
            targets: {
                "esmodules": true,
                ie: "11",
                edge: "17",
                firefox: "60",
                chrome: "67",
                safari: "11.1",
            },
            useBuiltIns: "usage",
        },
    ],
];

module.exports = {presets};
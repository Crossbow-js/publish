"use strict";

exports.config = {
    seleniumAddress: "http://localhost:4444/wd/hub",
    baseUrl: 'http://' + process.env["CBBASE_URL"],
    specs: [
        "specs/*.js"
    ]
};

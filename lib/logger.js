var logger  = require("eazy-logger").Logger({
    prefix: "{magenta:crossbow.io} {cyan:::} }",
    useLevelPrefixes: true,
    logLevel: 'warn'
});

module.exports = logger;
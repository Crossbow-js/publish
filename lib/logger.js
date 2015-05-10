var logger  = require("eazy-logger").Logger({
    prefix: "{grey:crossbow.io} {magenta:->} }",
    useLevelPrefixes: true,
    logLevel: 'warn'
});

module.exports = logger;
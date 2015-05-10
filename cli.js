#!/usr/bin/env node

var meow = require('meow');
var cli  = meow({help: "yep"});

if (!module.parent) {
    handleCli(cli);
}

function handleCli(cli) {
    try {
        require('./lib/command.' + cli.input[0])(cli.flags);
    } catch (e) {
        console.error(e);
        console.log(e.stack);
    }
}
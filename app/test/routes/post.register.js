var request = require('supertest');
var assert  = require('chai').assert;
var utils = require('../../utils');
var cheerio = require('cheerio');

describe('Posting to the register route', function () {
    it('shows the form for registration with _csrf', function (done) {
        var server = utils.createApp().listen();
        request(server)
            .get('/register')
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                var body = $('body');
                assert.deepEqual(body.find('input[name="_csrf"]').length, 1);
                server.close();
                done();
            });
    });
});
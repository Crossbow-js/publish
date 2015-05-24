var request = require('supertest');
var assert  = require('chai').assert;
var utils = require('../../utils');
var cheerio = require('cheerio');

describe('Homepage route', function () {
    it('shows the correct view for a non-logged in user', function (done) {
        var server = utils.createApp().listen();
        request(server)
            .get('/')
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                assert.deepEqual($('body').find('a[href="/login"]').length, 1);
                server.close();
                done();
            });
    });
});
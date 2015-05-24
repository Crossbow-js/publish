var Faker = require('faker');
var utils = require('../utils');
describe('Register specs', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get('/register');
    });
    describe('Correct elements', function () {
        it("should have the correct title", function () {
            expect(element.all(by.css('title')).get(0).getInnerHtml()).toBe('Register');
        });
        it("Should render the fields for the form", function () {
            expect(element.all(by.css('title')).get(0).getInnerHtml()).toBe('Register');
        });
    });
    describe('Submitting the form', function () {
        var user;
        beforeEach(function () {
            user = utils.getRandomUser();
        });
        it("should have correct form elements", function () {
            var form = element.all(by.id('register'));
            expect(element.all(by.id('register')).count()).toBe(1);
            expect(form.all(by.css('input')).count()).toBe(7);
        });
        it("should accept registration for a free account", function () {
            user.account = 'free';
            utils.registerAttempt(user, '/dashboard');
        });
        it("should accept registration for a pro account", function () {
            user.account = 'pro';
            utils.registerAttempt(user, '/payment');
        });
        it("should accept registration for an unlimited account", function () {
            user.account = 'unlimited';
            utils.registerAttempt(user, '/payment');
        });
    });
});

var Faker    = require('faker');
var utils    = require('../utils');
var db       = require('../../../lib/db');
var models   = require('../../../models');
var mongoose = require('mongoose');

describe('Register specs', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get('/register');
        var flow = protractor.promise.controlFlow();
        var d = protractor.promise.defer();
        flow.execute(function () {
            models.User
                .remove(function (err, result) {
                    if (err) {
                        return d.reject(err);
                    }
                    d.fulfill();
                });
            return d.promise;
        })
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
            utils.registerAttempt(user);
            expect(browser.getCurrentUrl()).toContain('/dashboard');
        });
        it("should accept registration for a pro account", function () {
            user.account = 'pro';
            utils.registerAttempt(user);
            expect(browser.getCurrentUrl()).toContain('/payment');
        });
        it("should accept registration for an unlimited account", function () {
            user.account = 'unlimited';
            utils.registerAttempt(user);
            expect(browser.getCurrentUrl()).toContain('/payment');
        });
    });
    describe('not allowing multiple signups with same email', function () {
        it('should stay on register page if duplicate email found', function () {

            var err  = require('../../../lib/errors').DUP_EMAIL;
            var elem = by.css('p.error');
            var user = {
                firstName:  Faker.name.firstName(),
                lastName:   Faker.name.lastName(),
                email:      'shakyshane@gmail.com',
                password:   '123456',
                subdomain:  Faker.internet.domainWord(),
                account:    'free'
            };

            utils.registerAttempt(user);

            browser.get('/logout');

            browser.get('/register');

            browser.pause();
            utils.registerAttempt(user);

            expect(browser.getCurrentUrl()).toContain('/register');
        });
    })
});

/**
 * @name waitForUrlToChangeTo
 * @description Wait until the URL changes to match a provided regex
 * @param {RegExp} urlRegex wait until the URL changes to match this regex
 * @returns {!webdriver.promise.Promise} Promise
 */
function waitForUrlToChangeTo(urlRegex) {
    var currentUrl;

    return browser.getCurrentUrl().then(function storeCurrentUrl(url) {
            currentUrl = url;
        }
    ).then(function waitForUrlToChangeTo() {
            return browser.wait(function waitForUrlToChangeTo() {
                return browser.getCurrentUrl().then(function compareCurrentUrl(url) {
                    return urlRegex.test(url);
                });
            });
        }
    );
}
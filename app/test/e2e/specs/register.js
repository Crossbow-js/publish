var Faker = require('faker');

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
        it("should have correct form elements", function () {
            var form = element.all(by.id('register'));
            expect(element.all(by.id('register')).count()).toBe(1);
            expect(form.all(by.css('input')).count()).toBe(7);
        });
        it("should accept registration for a free account", function () {
            element(by.css('input[name="firstName"]')).sendKeys('shane');
            element(by.css('input[name="lastName"]')).sendKeys(Faker.name.lastName());
            element(by.css('input[name="email"]')).sendKeys(Faker.internet.email());
            element(by.css('input[name="password"]')).sendKeys('123456');
            element(by.cssContainingText('option', 'Free')).click();
            element(by.css('input[name="subdomain"]')).sendKeys('shane');
            element(by.css('input[type="submit"]')).click();
            expect(browser.getCurrentUrl()).toContain('/dashboard');
        });
        it("should accept registration for a pro account", function () {
            element(by.css('input[name="firstName"]')).sendKeys('shane');
            element(by.css('input[name="lastName"]')).sendKeys(Faker.name.lastName());
            element(by.css('input[name="email"]')).sendKeys(Faker.internet.email());
            element(by.css('input[name="password"]')).sendKeys('123456');
            element(by.cssContainingText('option', 'Pro')).click();
            element(by.css('input[name="subdomain"]')).sendKeys('shane');
            element(by.css('input[type="submit"]')).click();
            expect(browser.getCurrentUrl()).toContain('/payment');
        });
        it("should accept registration for an unlimited account", function () {
            element(by.css('input[name="firstName"]')).sendKeys('shane');
            element(by.css('input[name="lastName"]')).sendKeys(Faker.name.lastName());
            element(by.css('input[name="email"]')).sendKeys(Faker.internet.email());
            element(by.css('input[name="password"]')).sendKeys('123456');
            element(by.cssContainingText('option', 'Unlimited')).click();
            element(by.css('input[name="subdomain"]')).sendKeys('shane');
            element(by.css('input[type="submit"]')).click();
            expect(browser.getCurrentUrl()).toContain('/payment');
        });
    });
});

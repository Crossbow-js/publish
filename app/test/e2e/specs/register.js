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
        it("should accept registration for a pro account", function () {
            element(by.css('input[name="firstName"]')).sendKeys('shane');
            element(by.css('input[name="lastName"]')).sendKeys('osbourne');
            element(by.css('input[name="email"]')).sendKeys('shakyshane@gmail.com');
            element(by.css('input[name="password"]')).sendKeys('123456');
            element(by.cssContainingText('option', 'Pro')).click();
            element(by.css('input[name="subdomain"]')).sendKeys('shane');

            element(by.css('input[type="submit"]')).click();
            expect(browser.getCurrentUrl()).toContain('/payment');
        });
    });
});

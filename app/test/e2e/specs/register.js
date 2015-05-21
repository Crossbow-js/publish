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
});

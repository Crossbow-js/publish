"use strict";

describe('Homepage specs', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get('/');
    });
    describe('Correct elements', function () {
        it("should have the correct title", function () {
            expect(element.all(by.css('title')).get(0).getInnerHtml()).toBe('Crossbow Sites');
        });
        it("should have a register link", function () {
            expect(element.all(by.css('a[href="/register"]')).count()).toBe(1);
        });
        it("should have a login link", function () {
            expect(element.all(by.css('a[href="/login"]')).count()).toBe(1);
        });
    });
});

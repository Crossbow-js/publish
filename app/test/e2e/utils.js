var Faker = require('faker');

module.exports = {
    registerAttempt: function (input) {
        element(by.css('input[name="firstName"]')).sendKeys(input.firstName);
        element(by.css('input[name="lastName"]')).sendKeys(input.lastName);
        element(by.css('input[name="email"]')).sendKeys(input.email);
        element(by.css('input[name="password"]')).sendKeys(input.password);
        element(by.css('option[value="'+input.account+'"]')).click();
        element(by.css('input[name="subdomain"]')).sendKeys(input.subdomain);
        element(by.css('input[type="submit"]')).click();
    },
    getRandomUser: function () {

        var input = {
            firstName:  Faker.name.firstName(),
            lastName:   Faker.name.lastName(),
            email:      Faker.internet.email(),
            password:   '123456',
            subdomain:  Faker.internet.domainWord(),
            account:    'free'
        };

        return input;
    }
};
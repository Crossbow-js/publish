function isPaidAccount (type) {
    console.log(type);
    return type === 'pro' || type === 'unlimited';
}

module.exports.isPaidAccount = isPaidAccount;
module.exports.route = '/payment';
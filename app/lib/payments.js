function isPaidAccount (type) {
    return type === 'pro' || type === 'premium';
}

module.exports.isPaidAccount = isPaidAccount;
module.exports.route = '/payment';
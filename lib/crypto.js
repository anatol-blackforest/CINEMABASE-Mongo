//password handler
const crypto = require('crypto');

module.exports = password => crypto.createHmac('sha1', 'abc').update(password).digest('hex'); 

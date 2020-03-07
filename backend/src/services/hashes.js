const bCrypt = require('bcrypt-nodejs');

var createHash = function(password) {
    let salt = bCrypt.genSaltSync(10);
    let hash = bCrypt.hashSync(password, salt);

    return hash;
}

var validateHash = function(userPassword, enteredPassword) {
    return bCrypt.compareSync(enteredPassword, userPassword);
} 

module.exports = {
    createHash,
    validateHash,
};
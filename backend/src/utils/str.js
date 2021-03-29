// const Regex = require('regex');
module.exports = {

    validateString(str, fieldName, isRequired, maxLen, regex) {
        if (isRequired && !str) {
            return `O campo '${fieldName}' é obrigatório`;
        }
    
        if (str.length > maxLen) {
            return `O campo '${fieldName}' só aceita no máximo ${maxLen} caracteres`;
        }
    
        // if (regex) {
        //     const reg = new Regex(regex);
        //     if (reg.test(str) == false) {
        //         return `O campo ${fieldName} contem caracteres inválidos`;
        //     }
        // }
    
        else {
            return null;
        }
    }
}
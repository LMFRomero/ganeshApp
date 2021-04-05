const regexp = {
    slugName: /^[a-zA-Z0-9-]*$/g,
    alpha: /^[a-zA-ZáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇüñÜÑ ]*$/g,
    num: /^[0-9]*$/g,
    alNum: /^[a-zA-Z0-9áéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇüñÜÑ ]*$/g,
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    alNumWithSymb: /^[a-zA-Z0-9áéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇüñÜÑ@$!%*#?&/ -]*$/g,
};

module.exports = {
    regexp,

    validateString(str, fieldName, isRequired, maxLen, regex) {
        if (!isRequired && !str) {
            return null;
        }

        if (!str) {
            return `O campo '${fieldName}' é obrigatório`;
        }
        
        if (str.length > maxLen) {
            return `O campo '${fieldName}' só aceita no máximo ${maxLen} caracteres`;
        }
    
        if (regex && str) {
            if (str.match(regex) == null) {
                return `O campo ${fieldName} contem caracteres inválidos`;
            }
        }
    
        else {
            return null;
        }
    },
}
module.exports = {
    async SafeFindOne(obj, params) {
        let answerFromDB;

        try {
            answerFromDB = await obj.findOne(params);
        } catch (error) {
            console.log(error);
            return null;
        }

        return answerFromDB;
    },

    async SafeCreateObj (obj, params) {
        let answerFromDB;

        try {
            answerFromDB = await obj.create(params);
        } catch (error) {
            console.log(error);
            return null;
        }

        return answerFromDB;
    },

    async SafeDeleteOne (obj, params) {
        let answerFromDB;

        try {
            answerFromDB = await obj.deleteOne(params);
        } catch (error) {
            console.log(error);
            return null;
        }

        return answerFromDB;
    },

    async SafeUpdateOne (obj, attToFind, newAtt) {
        let answerFromDB;

        try {
            answerFromDB = await obj.deleteOne(attToFind, newAtt);
        } catch (error) {
            console.log(error);
            return null;
        }

        return answerFromDB;
    },
}
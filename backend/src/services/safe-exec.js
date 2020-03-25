module.exports = {
    async SafeFindOne(collection, params) {
        let answerFromDB;

        try {
            answerFromDB = await collection.findOne(params);
        } catch (error) {
            console.log(error);
            return -1;
        }

        return answerFromDB;
    },

    async SafeCreateObj (collection, params) {
        let answerFromDB;

        try {
            answerFromDB = await collection.create(params);
        } catch (error) {
            console.log(error);
            return null;
        }

        return answerFromDB;
    },

    async SafeDeleteOne (collection, params) {
        let answerFromDB;

        try {
            answerFromDB = await collection.deleteOne(params);
        } catch (error) {
            console.log(error);
            return null;
        }

        return answerFromDB;
    },

    async SafeUpdateOne (collection, attToFind, newAtt) {
        let answerFromDB;

        try {
            answerFromDB = await collection.updateOne(attToFind, newAtt);
        } catch (error) {
            console.log(error);
            return null;
        }

        return answerFromDB;
    },

    async SafeFindById(collection, param) {
        let answerFromDB;

        try {
            answerFromDB = await collection.findById(param);
        } catch (error) {
            console.log(error);
            return null;
        }

        return answerFromDB;
    },

    async SafeFind(collection, param) {
        let answerFromDB;

        try {
            answerFromDB = await collection.find(param);
        } catch (error) {
            console.log(error);
            return null;
        }

        return answerFromDB;
    }
}
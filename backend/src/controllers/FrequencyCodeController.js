const FrequencyCode = require('../models/FrequencyCode');
const Meeting = require('../models/Meeting');

const { validateString } = require('../utils/str');

function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function checkTime (date) {
    let now = new Date();
    if (now-date > 1000*60*(2*60)) { //more than 2h after
        return false;
    }
    else if (now < date) { //before
        return false;
    }

    return true;
}

module.exports = {
    async store (req, res) {
        let meetingId = req.params?.id;
        let resp = validateString(meetingId, "meetingId", true, 100);
        if (resp) {
            return res.status(400).json({ meetingId: resp });
        }

        try {
            var meeting = await Meeting.findById(meetingId);
        } catch (error) {
            if (error.kind == "ObjectId") {
                return res.status(404).json({ message: "Reunião não encontrada" });
            }

            console.log(error);
            return res.status(500).json({ message: "Não foi possível encontrar a reunião" });
        }
        if (!meeting) {
            return res.status(404).json({ message: "Reunião não encontrada" });
        }
        if (meeting.frequencyCode) {
            return res.status(400).json({ message: "Já existe um código pra essa reunião" });
        }

        if (checkTime(new Date(meeting.date)) == false) {
            return res.status(400).json({ message: "O código só pode ser criado a partir do início até duas horas depois do início da reunião" });
        }

        let foundCode = false;
        for (let i = 0; i < 3; i++) {
            var code = getRandomInt(8999)+1000;

            try {
                var frequencyCode = await FrequencyCode.findOne({ code });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Não foi possível encontrar código" });
            }
            if (!frequencyCode) {
                foundCode = true;
                break;
            }
        }
        if (foundCode == false) {
            return res.status(500).json({ message: "Não foi possível gerar código para essa reunião. Tente novamente" });
        }


        let now = new Date();
        let finish = new Date(meeting.date);
        finish.setTime(finish.getTime() + ((2 * 60 + 30) * 60 * 1000));
        
        let ttl = finish-now;

        try {
            frequencyCode = await FrequencyCode.create({
                code,
                meeting: meetingId,
                creator: req.user?._id,
                createdAt: new Date(),
                ttl
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Não foi possível gerar o código da reunião" });
        }

        meeting.frequencyCode = frequencyCode._id;

        try {
            await meeting.save();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Não foi possível salvar código da reunião" });
        }

        return res.status(201).json({ message: "Código da reunião criado com sucesso, válido até 2h30 depois do início da reunião" });
    },
}
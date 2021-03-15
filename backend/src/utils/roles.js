const e = require("express");

let roles = {
    globals: {
        root: {
            roleInt: 0,
            title: "Root"
        },
        generalCoordinator: {
            roleInt: 11,
            title: "Coordenador Geral"
        },
        viceGeneralCoordinator: {
            roleInt: 12,
            title: "Vice Coordenador Geral"
        },
        HRCoordinator: {
            roleInt: 21,
            title: "Coordenador de Recursos Humanos"
        },
        secretary: {
            roleInt: 22,
            title: "Secretário"
        },
        estudiesCoordinator: {
            roleInt: 23,
            title: "Coordenador de Estudos"
        },
        member: {
            roleInt: 60,
            title: "Membro"
        },
        collaborator: {
            roleInt: 80,
            title: "Colaborador"
        },
        pingParticipant: {
            roleInt: 100,
            title: "Ingressante"
        },
    },

    getRoleInt (role) {
        let resp = roles.globals[role]?.roleInt;
        if (!resp) {
            return -1;
        }
        else {
            return resp;
        }
        
    },

    getTitle (roleInt) {
        role.globals.forEach((item) => {
            if (item.roleInt == roleInt) {
                return item.title;
            }
        });

        return null;
    },

    isCoordinator (roleInt) {
        return (roleInt < 30);
    }
};

module.exports = roles;
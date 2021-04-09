const e = require("express");

let roles = {
    globals: {
        root: {
            role: 0,
            title: "Root"
        },
        generalCoordinator: {
            role: 11,
            title: "Coordenador Geral"
        },
        viceGeneralCoordinator: {
            role: 12,
            title: "Vice Coordenador Geral"
        },
        HRCoordinator: {
            role: 21,
            title: "Coordenador de Recursos Humanos"
        },
        secretary: {
            role: 22,
            title: "Secretário"
        },
        estudiesCoordinator: {
            role: 23,
            title: "Coordenador de Estudos"
        },
        member: {
            role: 60,
            title: "Membro"
        },
        collaborator: {
            role: 80,
            title: "Colaborador"
        },
        pingParticipant: {
            role: 100,
            title: "Ingressante"
        },
        pendingApproval: {
            role: 120,
            title: "Pendente"
        }
    },

    getRole (role) {
        let resp = roles.globals[role]?.role;
        if (resp === undefined) {
            return -1;
        }
        else {
            return resp;
        }
        
    },

    getTitle (role) {
        for (let entry in roles.globals) {
            let item = roles.globals[entry];
            if (item.role == role) {
                return item.title;
            }
        };

        return null;
    },
};

module.exports = roles;
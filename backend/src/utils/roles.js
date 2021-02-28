let roles = {
    globals: {
        root: 0,
        generalCoordinator: 10,
        viceGeneralCoordinator: 11,
        HRCoordinator: 21,
        secretary: 22,
        estudiesCoordinator: 23,
        member: 60,
        collaborator: 80,
        pingParticipant: 100,
    },

    getRoleInt (role) {
        if (role == 'pingParticipant')          return roles.globals.pingParticipant;
        if (role == 'collaborator')             return roles.globals.collaborator;
        if (role == 'member')                   return roles.globals.member;
        if (role == 'generalCoordinator')       return roles.globals.generalCoordinator;
        if (role == 'viceGeneralCoordinator')   return roles.globals.viceGeneralCoordinator;
        if (role == 'HRCoordinator')            return roles.globals.HRCoordinator;
        if (role == 'estudiesCoordinator')      return roles.globals.estudiesCoordinator;
        if (role == 'secretary')                return roles.globals.secretary;
        if (role == 'root')                     return roles.globals.root;
        
        return -1;
    },

    getTitle (roleInt) {
        if (roleInt == roles.globals.pingParticipant)           return "Ingressante";
        if (roleInt == roles.globals.generalCoordinator)        return "Coordenador Geral";
        if (roleInt == roles.globals.viceGeneralCoordinator)    return "Vice Coordenador Geral";
        if (roleInt == roles.globals.HRCoordinator)             return "Coordenador de Recursos Humanos";
        if (roleInt == roles.globals.secretary)                 return "Secretário";
        if (roleInt == roles.globals.estudiesCoordinator)       return "Coordenador de Estudos";
        if (roleInt == roles.globals.member)                    return "Membro";
        if (roleInt == roles.globals.collaborator)              return "Colaborador";

        return null;
    }
};

module.exports = roles;
let roles = {
    globals: {
        root: {
            roleInt: 0,
            accountPerms: 31,
        },

        generalCoordinator: {
            roleInt: 10,
            accountPerms: 31,
        }, 

        viceGeneralCoordinator: {
            roleInt: 11,
            accountPerms: 31,
        },

        HRCoordinator: {
            roleInt: 21,
            accountPerms: 31,
        },

        secretary: {
            roleInt: 22,
            accountPerms: 31,
        },

        estudiesCoordinator: {
            roleInt: 23,
            accountPerms: 31,
        },
      
        member: {
            roleInt: 60,
            accountPerms: 0,
        },
        
        collaborator: {
            roleInt: 80,
            accountPerms: 0,
        },
    },

    getGlobalTemplate (role) {
        if (role == 'collaborator') return roles.globals.collaborator;
        if (role == 'member') return roles.globals.member;
        if (role == 'generalCoordinator') return roles.globals.generalCoordinator;
        if (role == 'viceGeneralCoordinator') return roles.globals.viceGeneralCoordinator;
        if (role == 'HRCoordinator') return roles.globals.HRCoordinator;
        if (role == 'estudiesCoordinator') return roles.globals.estudiesCoordinator;
        if (role == 'secretary') return roles.globals.secretary;
        if (role == 'root') return roles.globals.root;
        
        return null;
    },
};

module.exports = roles;
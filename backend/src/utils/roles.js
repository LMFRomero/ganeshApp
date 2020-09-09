module.exports = {
    globals: {
        collaborator: {
            roleInt: 200,
            accountPerms: 0,
        },
        member: {
            roleInt: 100,
            accountPerms: 0,
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
            roleInt: 61,
            accountPerms: 31,
        },

        estudiesCoordinator: {
            roleInt: 62,
            accountPerms: 31,
        },

        secretary: {
            roleInt: 63,
            accountPerms: 31,
        },

        root: {
            roleInt: 0,
            accountPerms: 31,
        }
    },

    getGlobalTemplate (role) {
        if (role == 'collaborator') return this.globals.collaborator;
        if (role == 'member') return this.globals.member;
        if (role == 'generalCoordinator') return this.globals.generalCoordinator;
        if (role == 'viceGeneralCoordinator') return this.globals.viceGeneralCoordinator;
        if (role == 'HRCoordinator') return this.globals.HRCoordinator;
        if (role == 'estudiesCoordinator') return this.globals.estudiesCoordinator;
        if (role == 'secretary') return this.globals.secretary;
        if (role == 'root') return this.globals.root;
        
        return null;
    },
}
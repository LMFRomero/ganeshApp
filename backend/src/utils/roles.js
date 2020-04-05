module.exports = {
    globals: {
        member: {
            roleInt: 1000,
            materialPerms: 0,
            meetingsPerms: 0,
            presentationPerms: 0,
            accountPerms: 0,
        },

        generalCoordinator: {
            roleInt: 100,
            materialPerms: 15,
            meetingsPerms: 15,
            presentationPerms: 7,
            accountPerms: 31,
        }, 

        viceGeneralCoordinator: {
            roleInt: 200,
            materialPerms: 15,
            meetingsPerms: 15,
            presentationPerms: 7,
            accountPerms: 31,
        },

        HRCoordinator: {
            roleInt: 300,
            materialPerms: 1,
            meetingsPerms: 15,
            presentationPerms: 1,
            accountPerms: 31,
        },

        estudiesCoordinator: {
            roleInt: 300,
            materialPerms: 15,
            meetingsPerms: 15,
            presentationPerms: 7,
            accountPerms: 20,
        },

        secretary: {
            roleInt: 300,
            materialPerms: 1,
            meetingsPerms: 7,
            presentationPerms: 1,
            accountPerms: 31,
        },

        root: {
            roleInt: 0,
            materialPerms: 15,
            meetingsPerms: 15,
            presentationPerms: 7,
            accountPerms: 31,
        }
    },
    
    front: {
        coordinator: {
            materialPerms: 15,
            meetingsPerms: 15,
            presentationPerms: 7,
        },
        member: {
            materialPerms: 0,
            meetingsPerms: 0,
            presentationPerms: 0,
        }
    }
}
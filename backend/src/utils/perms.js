module.exports = {
    global: {
        GLOBAL: {
            materialPermissions: {
                NONE: 0,
                ADD: 1,
                REMOVE: 2,
                UPDATE: 4,
                APPROVE: 8,
                ALL: 15
            },
            meetingsPermission: {
                NONE: 0,
                ADD: 1,
                REMOVE: 2,
                UPDATE: 4,
                MANUAL_FREQ_SET: 8,
                ALL: 15
            },
            presentationPermissions: {
                NONE: 0,
                ADD: 1,
                REMOVE: 2,
                UPDATE: 4,
                ALL: 7
            },
            accountPermissions: {
                NONE: 0,
                CREATE: 1,
                DELETE: 2,
                CHANGE_ROLE: 4,
                APPROVE: 8,
                KICK_FRONT: 16,
                ALL: 31 
            }
        }
    },

    front: {
        materialPermissions: {
            NONE: 0,
            ADD: 1,
            REMOVE: 2,
            UPDATE: 4,              //change attributes
            APPROVE: 8,             //accept new material posts
            ALL: 15
        },
        meetingsPermission: {
            NONE: 0,
            ADD: 1,
            REMOVE: 2,
            UPDATE: 4,              //generate a QRCode
            MANUAL_FREQ_SET: 8,     //set frequency of a member in a way other than QRCode
            ALL: 15
        },
        presentationPermissions: {
            NONE: 0,
            ADD: 1,
            REMOVE: 2,
            UPDATE: 4,              //change attributes
            ALL: 7
        },
    }
}
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        description: {
            type: String,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        deletedAt: {
            type: Date,
            default: null,
        },

    })
module.exports = mongoose.model('Permission', permissionSchema);

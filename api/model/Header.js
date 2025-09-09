const mongoose = require("mongoose");

const HeaderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    headerlogo: { type: String, default: null },
    menu: [
        {
            name: String,
            link: String,
            visible: { type: Boolean, default: true },
            submenu: [
                {
                    name: String,
                    link: String,
                    visible: { type: Boolean, default: true },
                }
            ]
        },
    ],
    cta: {
        placeholder: String,
        infoText: String,
        link: String,
        visible: { type: Boolean, default: true },
    },
    visible: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Header", HeaderSchema);

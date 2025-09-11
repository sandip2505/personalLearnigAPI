const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ["pending", "success", "failed"], 
        default: "pending" 
    },
    transactionId: { 
        type: String 
    },
    paymentDate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Payment", paymentSchema);

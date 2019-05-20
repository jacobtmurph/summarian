// Load modules
const mongoose = require('mongoose');

// Define the schema
const SummarySchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postedOn: {
        type: Date,
        default: Date.now
    },
    bookRating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    approval: {
        type: Number,
        default: 0
    },
    summaryContent: {
        type: String,
        required: true
    },
    responses: [{ body: String,
                  posted: { type: Date, default: Date.now },
                  responsedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'} 
                }]
});

const Summary = mongoose.model('Summary', SummarySchema);
module.exports = Summary;
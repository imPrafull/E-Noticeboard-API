const mongoose = require('mongoose');
const SubgroupSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {timestamps: true});

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subgroups: [SubgroupSchema]
}, {timestamps: true});

module.exports = mongoose.model('Group', GroupSchema);
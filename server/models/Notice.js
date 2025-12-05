const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ['normal', 'important'], default: 'normal' },
    createdAt: { type: Date, default: Date.now },
    expiryDate: { type: Date } // Optional: auto-hide after this date
});

module.exports = mongoose.model('Notice', noticeSchema);

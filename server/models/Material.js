const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Notes', 'Syllabus', 'PYQ'], required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    filePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    year: { type: String, enum: ['1st Year', '2nd Year', '3rd Year'], required: true },
    semester: { type: String } // Optional
});

module.exports = mongoose.model('Subject', subjectSchema);

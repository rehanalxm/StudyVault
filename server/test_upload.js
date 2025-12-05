const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const uploadFile = async () => {
    try {
        const form = new FormData();
        form.append('title', 'Test PDF');
        form.append('type', 'Notes');
        // We need a valid subject ID. Let's fetch one first or just use a dummy if validation allows (it requires valid ID).
        // Let's first get subjects
        const subjectsRes = await axios.get('http://localhost:5000/api/subjects');
        if (subjectsRes.data.length === 0) {
            console.log('No subjects found. Cannot upload.');
            return;
        }
        const subjectId = subjectsRes.data[0]._id;
        form.append('subjectId', subjectId);
        form.append('file', fs.createReadStream(path.join(__dirname, 'test.pdf')));

        console.log('Uploading test.pdf...');
        const res = await axios.post('http://localhost:5000/api/materials', form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('Upload successful:', res.data);
    } catch (err) {
        console.error('Upload failed:', err.response ? err.response.data : err.message);
    }
};

uploadFile();

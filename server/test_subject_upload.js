const axios = require('axios');

async function testSubjectUpload() {
    try {
        const res = await axios.post('http://localhost:5000/api/subjects', {
            name: 'Test Subject ' + Date.now(),
            year: '1st Year',
            semester: 'Sem 1'
        });
        console.log('Subject created:', res.data);
    } catch (err) {
        console.error('Error creating subject:', err.response ? err.response.data : err.message);
    }
}

testSubjectUpload();

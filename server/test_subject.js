const axios = require('axios');

const addSubject = async () => {
    try {
        const subject = {
            name: 'Test Subject ' + Date.now(),
            year: '1st Year',
            semester: 'Sem 1'
        };
        console.log('Adding subject:', subject);
        const res = await axios.post('http://localhost:5000/api/subjects', subject);
        console.log('Subject added successfully:', res.data);
    } catch (err) {
        console.error('Error adding subject:', err.response ? err.response.data : err.message);
    }
};

addSubject();

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let subjectId = '';
let materialId = '';

async function runCheck() {
    console.log('--- Starting Full System Check ---\n');

    // 1. Test Login
    try {
        console.log('1. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/login`, { password: 'admin123' });
        authToken = loginRes.data.token;
        console.log('✅ Login Successful');
    } catch (err) {
        console.error('❌ Login Failed:', err.response?.data || err.message);
        return;
    }

    // 2. Test Create Subject
    try {
        console.log('\n2. Testing Subject Creation...');
        const subjectRes = await axios.post(`${API_URL}/subjects`, {
            name: 'Health Check Subject ' + Date.now(),
            year: '1st Year',
            semester: 'Test'
        });
        subjectId = subjectRes.data._id;
        console.log('✅ Subject Created:', subjectRes.data.name);
    } catch (err) {
        console.error('❌ Subject Creation Failed:', err.response?.data || err.message);
    }

    // 3. Test File Upload (GridFS)
    try {
        console.log('\n3. Testing Material Upload...');
        // Create dummy PDF
        fs.writeFileSync('test_health.pdf', 'Dummy PDF Content');

        const form = new FormData();
        form.append('title', 'Health Check Material');
        form.append('type', 'Notes');
        form.append('subjectId', subjectId);
        form.append('file', fs.createReadStream('test_health.pdf'));

        const uploadRes = await axios.post(`${API_URL}/materials`, form, {
            headers: { ...form.getHeaders() }
        });
        materialId = uploadRes.data._id;
        console.log('✅ Material Uploaded. FilePath:', uploadRes.data.filePath);

        // 4. Test File Download
        console.log('\n4. Testing File Download...');
        // Extract filename from stored path (api/files/filename)
        const downloadUrl = `http://localhost:5000/${uploadRes.data.filePath}`;
        console.log('   Downloading from:', downloadUrl);

        const downloadRes = await axios.get(downloadUrl);
        if (downloadRes.status === 200) {
            console.log('✅ File Download Successful');
        }
    } catch (err) {
        console.error('❌ File Operations Failed:', err.response?.data || err.message);
    }

    // 5. Test Change Password (and revert)
    try {
        console.log('\n5. Testing Change Password...');
        // Change to 'newpass'
        await axios.post(`${API_URL}/change-password`, {
            currentPassword: 'admin123',
            newPassword: 'newpass'
        });
        console.log('   Password changed to "newpass"');

        // Verify login with new pass
        await axios.post(`${API_URL}/login`, { password: 'newpass' });
        console.log('   Login with new password worked');

        // Revert to 'admin123'
        await axios.post(`${API_URL}/change-password`, {
            currentPassword: 'newpass',
            newPassword: 'admin123'
        });
        console.log('✅ Password Reverted to "admin123"');
    } catch (err) {
        console.error('❌ Password Check Failed:', err.response?.data || err.message);
    }

    // Cleanup
    try {
        console.log('\n6. Cleaning Up...');
        if (materialId) await axios.delete(`${API_URL}/materials/${materialId}`);
        if (subjectId) await axios.delete(`${API_URL}/subjects/${subjectId}`);
        fs.unlinkSync('test_health.pdf');
        console.log('✅ Cleanup Successful');
    } catch (err) {
        console.error('⚠️ Cleanup Warning:', err.message);
    }

    console.log('\n--- System Check Complete ---');
}

runCheck();

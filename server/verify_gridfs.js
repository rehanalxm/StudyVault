const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

// Create a dummy file
fs.writeFileSync('test_upload.txt', 'This is a test PDF content');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to DB');
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'studyvault_materials'
    });

    // Simulate upload
    const uploadStream = bucket.openUploadStream('test_upload.txt');
    fs.createReadStream('test_upload.txt').pipe(uploadStream);

    uploadStream.on('finish', async () => {
        console.log('Upload successful');

        // Verify it exists
        const files = await bucket.find({ filename: 'test_upload.txt' }).toArray();
        console.log('Files found in DB:', files.length);
        console.log('Filename:', files[0].filename);

        // Clean up
        await bucket.delete(files[0]._id);
        console.log('Cleanup successful');
        process.exit(0);
    });
}).catch(err => {
    console.error(err);
    process.exit(1);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('MongoDB Connected');
        const db = mongoose.connection.db;
        // Initialize GridFSBucket
        const bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: 'studyvault_materials'
        });
        app.locals.bucket = bucket;
        console.log('GridFS Bucket Initialized');

        // Seed Admin
        const Admin = require('./models/Admin');
        const bcrypt = require('bcryptjs');
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await new Admin({ username: 'admin', password: hashedPassword }).save();
            console.log('Default Admin Account Created');
        }
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

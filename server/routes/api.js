const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Subject = require('../models/Subject');
const Material = require('../models/Material');
const Notice = require('../models/Notice');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret for JWT (should be in env, using default for now as user didn't provide one)
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_change_this';

const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');

// GridFS Storage Configuration
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return {
            bucketName: 'studyvault_materials',
            filename: `${Date.now()}-${file.originalname}`
        };
    }
});

const upload = multer({ storage: storage });

// --- Auth Routes ---

// Login
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;
        // In a real app we would check username too, but here we assume single admin
        const admin = await Admin.findOne({ username: 'admin' });

        if (!admin) {
            return res.status(401).json({ error: 'Admin not initialized' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, message: 'Logged in successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Change Password
router.post('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin.findOne({ username: 'admin' });

        if (!admin) return res.status(404).json({ error: 'Admin not found' });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Public Routes ---

// Get file (stream from GridFS)
router.get('/files/:filename', async (req, res) => {
    try {
        const bucket = req.app.locals.bucket;
        if (!bucket) {
            return res.status(500).json({ error: 'Storage not initialized' });
        }

        const filename = req.params.filename;
        const files = await bucket.find({ filename }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = files[0];
        if (file.contentType) {
            res.set('Content-Type', file.contentType);
        }
        res.set('Content-Disposition', `inline; filename="${file.filename}"`);

        const downloadStream = bucket.openDownloadStreamByName(filename);
        downloadStream.pipe(res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all subjects (optionally filtered by year)
router.get('/subjects', async (req, res) => {
    try {
        const { year } = req.query;
        const query = year ? { year } : {};
        const subjects = await Subject.find(query);
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get materials for a subject
router.get('/materials', async (req, res) => {
    try {
        const { subjectId, type } = req.query;
        const query = {};
        if (subjectId) query.subjectId = subjectId;
        if (type) query.type = type;

        const materials = await Material.find(query).populate('subjectId');
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Admin Routes ---

// Add a Subject
router.post('/subjects', async (req, res) => {
    try {
        const { name, year, semester } = req.body;
        const newSubject = new Subject({ name, year, semester });
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload Material
router.post('/materials', upload.single('file'), async (req, res) => {
    try {
        const { title, type, subjectId } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // Store path as api/files/filename so client constructs correct URL
        const filePath = `api/files/${req.file.filename}`;

        const newMaterial = new Material({
            title,
            type,
            subjectId,
            filePath: filePath
        });
        await newMaterial.save();
        res.status(201).json(newMaterial);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Material
router.delete('/materials/:id', async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) return res.status(404).json({ error: 'Material not found' });

        // Delete file from GridFS
        // format: api/files/filename
        const filename = material.filePath.split('/').pop();
        if (filename && req.app.locals.bucket) {
            try {
                // Find file by name to get ID (needed for delete in some driver versions) or openDeleteStream
                // GridFSBucket.delete(id)
                const files = await req.app.locals.bucket.find({ filename }).toArray();
                if (files.length > 0) {
                    await req.app.locals.bucket.delete(files[0]._id);
                }
            } catch (err) {
                console.error("Error deleting file from GridFS:", err);
                // Continue to delete record
            }
        }

        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: 'Material deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Subject
router.delete('/subjects/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        // Delete all materials linked to this subject
        await Material.deleteMany({ subjectId: req.params.id });

        // Delete the subject
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject and related materials deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Notice Routes ---

// Get all active notices
router.get('/notices', async (req, res) => {
    try {
        const now = new Date();
        const notices = await Notice.find({
            $or: [
                { expiryDate: { $exists: false } },
                { expiryDate: null },
                { expiryDate: { $gte: now } }
            ]
        }).sort({ createdAt: -1 });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Notice (Admin)
router.post('/notices', async (req, res) => {
    try {
        const { title, content, priority, expiryDate } = req.body;
        const newNotice = new Notice({ title, content, priority, expiryDate });
        await newNotice.save();
        res.status(201).json(newNotice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Notice (Admin)
router.delete('/notices/:id', async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notice deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

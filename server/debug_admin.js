const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const verifyAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const admin = await Admin.findOne({ username: 'admin' });

        if (!admin) {
            console.log('❌ No Admin user found!');
        } else {
            console.log('✅ Admin user found: ' + admin.username);

            // Check password 'admin123'
            const isMatch = await bcrypt.compare('admin123', admin.password);
            if (isMatch) {
                console.log('✅ Password "admin123" is CORRECT');
            } else {
                console.log('❌ Password "admin123" is INCORRECT');
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

verifyAdmin();

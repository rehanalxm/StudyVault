const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const createAdminAccount = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('❌ Admin account already exists!');
            console.log('If you want to reset the password, delete the existing admin first.');
            process.exit(0);
        }

        // Default password (change this or pass as argument)
        const defaultPassword = process.argv[2] || 'admin123';

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        // Create admin account
        const admin = new Admin({
            username: 'admin',
            password: hashedPassword
        });

        await admin.save();
        console.log('✅ Admin account created successfully!');
        console.log('Username: admin');
        console.log('Password:', defaultPassword);
        console.log('\n⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin account:', error);
        process.exit(1);
    }
};

createAdminAccount();

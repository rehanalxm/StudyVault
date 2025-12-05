const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Update the password for 'admin' user
        const res = await Admin.findOneAndUpdate(
            { username: 'admin' },
            { password: hashedPassword },
            { new: true, upsert: true } // Create if not exists
        );

        console.log('------------------------------------------------');
        console.log('✅ PASSWORD RESET SUCCESSFUL');
        console.log('Username: admin');
        console.log('New Password: admin123');
        console.log('------------------------------------------------');

        process.exit(0);
    } catch (err) {
        console.error('Error resetting password:', err);
        process.exit(1);
    }
};

resetPassword();

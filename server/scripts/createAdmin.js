import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const args = process.argv.slice(2);
        const email = args[0];
        const initialPassword = args[1] || 'admin123';
        const name = args[2] || 'Admin User';

        if (!email) {
            console.log('Usage: node scripts/createAdmin.js <email> [password] [name]');
            process.exit(1);
        }

        let user = await User.findOne({ email });

        if (user) {
            console.log('User found. Updating role to admin...');
            user.role = 'admin';
            user.name = name === 'Admin User' ? user.name : name; // Only update name if provided or default
            await user.save();
            console.log(`✅ Successfully updated ${email} to admin role.`);
        } else {
            console.log('User not found. Creating new admin user...');
            user = await User.create({
                name,
                email,
                password: initialPassword,
                role: 'admin'
            });
            console.log(`✅ Successfully created new admin user: ${email}`);
        }

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();

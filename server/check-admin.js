import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const admins = await User.find({ role: 'admin' });
        console.log(`Found ${admins.length} admin users.`);
        if (admins.length > 0) {
            admins.forEach(a => console.log(`- ${a.email} (${a.name})`));
        } else {
            console.log('No admin users found.');
            // Check if any users exist at all
            const userCount = await User.countDocuments();
            console.log(`Total users in DB: ${userCount}`);
        }
        await mongoose.disconnect();
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

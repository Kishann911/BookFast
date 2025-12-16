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
        const email = 'admin@bookfast.com';
        const user = await User.findOne({ email });

        if (user) {
            user.password = 'admin123';
            await user.save();
            console.log(`Password for ${email} reset successfully.`);
        } else {
            console.log(`User ${email} not found.`);
        }

        await mongoose.disconnect();
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

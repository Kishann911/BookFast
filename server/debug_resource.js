import axios from 'axios';
import FormData from 'form-data';

const API_URL = 'http://localhost:5001/api';
const EMAIL = 'admin@bookfast.com';
const PASSWORD = 'admin123';

async function debug() {
    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: EMAIL,
            password: PASSWORD
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token obtained.');

        console.log('2. Creating resource with FormData...');
        const form = new FormData();
        form.append('name', 'Debug Desk');
        form.append('type', 'desk');
        form.append('capacity', '1');
        form.append('status', 'available');
        form.append('isActive', 'true');

        // Note: form-data in Node needs headers explicitly
        const config = {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        };

        const createRes = await axios.post(`${API_URL}/resources`, form, config);
        console.log('Resource created successfully:', createRes.data);

    } catch (error) {
        console.error('Error occurred!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

debug();

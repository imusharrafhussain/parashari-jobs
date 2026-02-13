import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testSubmit() {
    const form = new FormData();
    form.append('fullName', 'Test User');
    form.append('email', 'test@example.com');
    form.append('phone', '1234567890');
    form.append('city', 'Test City');
    form.append('state', 'Test State');
    form.append('collegeName', 'Test College');
    form.append('jobCategory', 'UI / UX Designers');
    form.append('customJobRole', '');

    // Create a dummy PDF
    const pdfPath = 'dummy.pdf';
    fs.writeFileSync(pdfPath, '%PDF-1.4\n%...'); // Minimal dummy PDF content
    form.append('resume', fs.createReadStream(pdfPath));

    try {
        console.log('Sending request to http://localhost:5000/api/applications/submit...');
        const response = await axios.post('http://localhost:5000/api/applications/submit', form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testSubmit();

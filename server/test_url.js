const https = require('https');

const baseUrl = 'https://res.cloudinary.com/dm9y0se4u/image/upload/v1764833011/studyvault_materials/lhxvegcfwqzc7nlodys2.pdf';
const attachmentUrl = 'https://res.cloudinary.com/dm9y0se4u/image/upload/fl_attachment/v1764833011/studyvault_materials/lhxvegcfwqzc7nlodys2.pdf';
const rawUrl = 'https://res.cloudinary.com/dm9y0se4u/raw/upload/v1764833011/studyvault_materials/lhxvegcfwqzc7nlodys2.pdf';

const checkUrl = (url, label) => {
    https.get(url, (res) => {
        console.log(`${label}: Status Code ${res.statusCode}`);
        if (res.statusCode >= 300 && res.statusCode < 400) {
            console.log(`${label}: Redirects to ${res.headers.location}`);
        }
    }).on('error', (e) => {
        console.error(`${label}: Error ${e.message}`);
    });
};

console.log('Testing URLs...');
checkUrl(baseUrl, 'Original (Image)');
checkUrl(attachmentUrl, 'Attachment (Image)');
checkUrl(rawUrl, 'Raw URL');

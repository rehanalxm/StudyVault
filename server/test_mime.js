// Test to see what multer-storage-cloudinary is doing
const file = {
    originalname: 'test.pdf',
    mimetype: 'application/pdf'
};

console.log('File:', file);
console.log('Mime:', file.mimetype);
const isPdf = file.mimetype === 'application/pdf';
console.log('isPdf:', isPdf);
console.log('resource_type should be:', isPdf ? 'raw' : 'auto');

const mongoose = require('mongoose');
const Material = require('./models/Material');
const Subject = require('./models/Subject');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to MongoDB');
        const materials = await Material.find({});
        console.log('--- MATERIALS ---');
        materials.forEach(m => {
            console.log(`Title: ${m.title}, Type: ${m.type}, FilePath: ${m.filePath}`);
        });
        console.log('-----------------');
        mongoose.connection.close();
    })
    .catch(err => console.error(err));

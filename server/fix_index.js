const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to MongoDB');
        const db = mongoose.connection.db;
        const collection = db.collection('subjects');

        // List all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', JSON.stringify(indexes, null, 2));

        // Drop the code_1 index if it exists
        try {
            await collection.dropIndex('code_1');
            console.log('Successfully dropped code_1 index');
        } catch (err) {
            console.log('Index code_1 does not exist or could not be dropped:', err.message);
        }

        mongoose.connection.close();
    })
    .catch(err => console.error(err));

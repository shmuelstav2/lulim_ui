const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Serve static files (like Excel file)
// Serve static files (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, 'new')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'new/index.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if the provided username and password match the hardcoded values
    if (username === 'lulim' && password === '12345') {
        // Authentication successful
        res.sendFile(path.join(__dirname, 'new/database.html'));
    } else {
        // Authentication failed
        res.redirect('/new/error.html');
    }
});

app.get('/api/tmuta', async (req, res) => {
    const mongoUri = 'mongodb://localhost:27017/';
    const dbName = 'lulim';
    const collectionName = 'tmuta_end';

    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch data from MongoDB excluding _id field
        const mongoData = await collection.find({}, { projection: { _id: 0 } }).toArray();

        // Format the date as dd/mm/yyyy
        const formattedData = mongoData.map(item => {
            if (item.date instanceof Date) {
                item.date = item.date.toLocaleDateString('en-GB');  // Use 'en-GB' for dd/mm/yyyy format
            }
            return item;
        });

        res.json(formattedData); // Return the data as JSON in the response
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close MongoDB connection
        client.close();
    }
});

app.get('/api/sivuk', async (req, res) => {
    const mongoUri = 'mongodb://localhost:27017/';
    const dbName = 'lulim';
    const collectionName = 'sivuk_end';

    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch data from MongoDB excluding _id field
        const mongoData = await collection.find({}, { projection: { _id: 0 } }).toArray();

        // Format the date as dd/mm/yyyy
        const formattedData = mongoData.map(item => {
            if (item.date instanceof Date) {
                item.date = item.date.toLocaleDateString('en-GB');  // Use 'en-GB' for dd/mm/yyyy format
            }
            return item;
        });

        res.json(formattedData); // Return the data as JSON in the response
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close MongoDB connection
        client.close();
    }
});

app.get('/api/notru', async (req, res) => {
    const mongoUri = 'mongodb://localhost:27017/';
    const dbName = 'lulim';
    const collectionName = 'notru_end';

    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch data from MongoDB excluding _id field
        const mongoData = await collection.find({}, { projection: { _id: 0 } }).toArray();

        // Format the date as dd/mm/yyyy
        const formattedData = mongoData.map(item => {
            if (item.date instanceof Date) {
                item.date = item.date.toLocaleDateString('en-GB');  // Use 'en-GB' for dd/mm/yyyy format
            }
            return item;
        });

        res.json(formattedData); // Return the data as JSON in the response
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close MongoDB connection
        client.close();
    }
});


app.get('/api/sivuk', async (req, res) => {
    const mongoUri = 'mongodb://localhost:27017/';
    const dbName = 'lulim';
    const collectionName = 'sivuk_end';

    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch data from MongoDB excluding _id field
        const mongoData = await collection.find({}, { projection: { _id: 0 } }).toArray();

        // Format the date as dd/mm/yyyy
        const formattedData = mongoData.map(item => {
            if (item.date instanceof Date) {
                item.date = item.date.toLocaleDateString('en-GB');  // Use 'en-GB' for dd/mm/yyyy format
            }
            return item;
        });

        res.json(formattedData); // Return the data as JSON in the response
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close MongoDB connection
        client.close();
    }
});

app.get('/api/skila', async (req, res) => {
    const mongoUri = 'mongodb://localhost:27017/';
    const dbName = 'lulim_new';
    const collectionName = 'skila';

    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch data from MongoDB excluding _id field
        const mongoData = await collection.find({}, { projection: { _id: 0 } }).toArray();

        // Format the date as dd/mm/yyyy
        const formattedData = mongoData.map(item => {
            if (item.date instanceof Date) {
                item.date = item.date.toLocaleDateString('en-GB');  // Use 'en-GB' for dd/mm/yyyy format
            }
            return item;
        });

        res.json(formattedData); // Return the data as JSON in the response
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close MongoDB connection
        client.close();
    }
});

app.get('/api/tmuta14', async (req, res) => {
    const mongoUri = 'mongodb://localhost:27017/';
    const dbName = 'lulim_new';
    const collectionName = 'tmuta14';

    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch data from MongoDB excluding _id field
        const mongoData = await collection.find({}, { projection: { _id: 0 } }).toArray();

        // Format the date as dd/mm/yyyy
        const formattedData = mongoData.map(item => {
            if (item.date instanceof Date) {
                item.date = item.date.toLocaleDateString('en-GB');  // Use 'en-GB' for dd/mm/yyyy format
            }
            return item;
        });

        res.json(formattedData); // Return the data as JSON in the response
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close MongoDB connection
        client.close();
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.json());

// Serve static files (CSS, JS, etc.)
app.use('/new', express.static('new'));

const mongoUri = 'mongodb://localhost:27017/';
const dbName = 'lulim';
const collectionName = 'logins'; // Collection for login actions
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'new/index.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username === 'lulim' && password === '12345') {
        // Successful login for user "lulim"
        console.log("Login successful for user 'lulim'");
        return res.sendFile(path.join(__dirname, 'new/database.html'));
    } else if (username === 'lulim2' && password === '12345') {
        // Successful login for user "lulim2"
        const currentDate = new Date();

        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            const actionData = {
                username: 'lulim2',
                action: 'login',
                date: currentDate.toISOString(),
                timestamp: currentDate.toLocaleString(),
            };

            await collection.insertOne(actionData);
            console.log("Login action logged for 'lulim2'");
        } catch (err) {
            console.error('Error connecting to MongoDB or inserting data:', err);
        } finally {
            await client.close();
        }

        return res.sendFile(path.join(__dirname, 'new/database.html'));
    } else {
        // Authentication failed
        console.log("Authentication failed for user:", username);
        return res.redirect('/static/error.html');
    }
});

// Fallback route for undefined paths


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'new/index.html'));
});
app.get('/sikumim', (req, res) => {
    console.log('GET request received at /sikumim');
    try {
        const filePath = path.join(__dirname, 'new/summary.html');
        console.log('Sending file:', filePath);
        return res.sendFile(filePath);
    } catch (err) {
        console.error('Error serving summary.html:', err);
        return res.status(500).send('Internal Server Error');
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

app.get('/api/sikumim', async (req, res) => {
    console.log("api sikumim");
    const mongoUri = 'mongodb://localhost:27017/';
    const dbName = 'lulim_new';
    const collectionName = 'sikum_midgar';

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

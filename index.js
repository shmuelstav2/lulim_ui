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
app.use(express.static(path.join(__dirname, 'Login_v2')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login_v2/index.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if the provided username and password match the hardcoded values
    if (username === 'lulim' && password === '12345') {
        // Authentication successful
        try {
            // Connect to MongoDB
            const mongoUri = 'mongodb://localhost:27017/';
            const dbName = 'lulim';
            const collectionName = 'tmuta_end';

            const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            // Fetch data from MongoDB excluding _id field
            // Fetch data from MongoDB excluding _id field
            const mongoData = await collection.find({}, { projection: { _id: 0 } }).toArray();

// Format the date as dd/mm/yyyy
            const formattedData = mongoData.map(item => {
                if (item.date instanceof Date) {
                    item.date = item.date.toLocaleDateString('en-GB');  // Use 'en-GB' for dd/mm/yyyy format
                }
                return item;
            });
            function generateTableHtml(data) {
                if (data.length === 0) {
                    return '<p>No data available</p>';
                }

                const headers = Object.keys(data[0]);

                // Create table header
                const headerHtml = headers.map(header => `<th>${header}</th>`).join('');

                // Create table rows
                const rowsHtml = data.map(row => {
                    const cellsHtml = headers.map(header => `<td>${row[header]}</td>`).join('');
                    return `<tr>${cellsHtml}</tr>`;
                }).join('');

                // Combine header and rows to create the table
                const tableHtml = `
        <table class="styled-table">
            <thead>
                <tr>${headerHtml}</tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>
    `;

                // Apply some basic styling to the table
                const styledTableHtml = `
        <style>
            body {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }

            .styled-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 18px;
                text-align: left;
            }

            .styled-table th,
            .styled-table td {
                padding: 12px 15px;
                border-bottom: 1px solid #ddd;
            }

            .styled-table th {
                background-color: #f2f2f2;
            }

            .styled-table tbody tr:nth-child(even) {
                background-color: #f5f5f5;
            }

            .table-container {
                text-align: center;
            }

            .table-heading {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin-bottom: 15px;
            }
        </style>
        <div class="table-container">
            <div class="table-heading">תמותה</div>
            ${tableHtml}
        </div>
    `;

                return styledTableHtml;
            }


            // Render the table with a headline
            const tableHtml = `${generateTableHtml(formattedData)}`;
            res.send(tableHtml);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            res.status(500).send('<h1>Internal Server Error</h1>');
        } finally {
            // Close MongoDB connection
            client.close();
        }
    } else {
        // Authentication failed
        res.send('<h1>Login Failed</h1>');
    }
});

function generateTableHtml(data) {
    if (data.length === 0) {
        return '<p>No data available</p>';
    }

    const headers = Object.keys(data[0]);
    const headerHtml = headers.map(header => `<th>${header}</th>`).join('');
    const rowsHtml = data.map(row => {
        const cellsHtml = headers.map(header => `<td>${row[header]}</td>`).join('');
        return `<tr>${cellsHtml}</tr>`;
    }).join('');

    return `<table border="1"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

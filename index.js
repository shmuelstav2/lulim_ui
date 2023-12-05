
// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Serve static files (like Excel file)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the provided username and password match the hardcoded values
    if (username === 'lulim' && password === '12345') {
        // Authentication successful
        // Read Excel file and render table
        const excelFilePath = 'C:\\Users\\User\\Dropbox\\BMC\\prod\\current active flocks\\status.xlsx';
        const workbook = xlsx.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Render the table with a headline
        const tableHtml = `<h1>תמותה</h1>${generateTableHtml(sheetData)}`;
        res.send(tableHtml);
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

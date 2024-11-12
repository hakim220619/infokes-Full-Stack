const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Update as per your MySQL configuration
    password: '',
    database: 'file_explorer'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database.');
});

// API to get all folders and files for a specific folder
app.get('/api/folders/:parentId', (req, res) => {
    const parentId = req.params.parentId;
    db.query(
        `SELECT * FROM folders WHERE parent_id = ?`,
        [parentId],
        (err, folders) => {
            if (err) return res.status(500).json({ error: err });
            
            db.query(
                `SELECT * FROM files WHERE folder_id = ?`,
                [parentId],
                (err, files) => {
                    if (err) return res.status(500).json({ error: err });
                    res.json({ folders, files });
                }
            );
        }
    );
});

// API to get the root folders (where parent_id is NULL)
app.get('/api/folders', (req, res) => {
    db.query(`SELECT * FROM folders WHERE parent_id IS NULL`, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

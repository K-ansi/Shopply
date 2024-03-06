const express = require('express');
const connectDB = require('./database');
const mongoose = require('mongoose')
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

//Connect DB
connectDB()

app.use(express.static(path.join(__dirname, '../dist/shopply')));

app.get('/api/test', (req, res) => {
    res.json({ message: 'test successful' });
  });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/shopply/browser/index.html'));
});

mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
  });
})



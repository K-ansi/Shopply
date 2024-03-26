const express = require('express');
const connectDB = require('./database');
const mongoose = require('mongoose')
const usersRouter = require('./routes/users.routes');
const path = require('path');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  }));

const port = process.env.PORT || 3000;

//Connect DB
connectDB()

app.use(express.static(path.join(__dirname, '../dist/shopply/browser')));
app.use(express.json());
app.use('/api/users', usersRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/shopply/browser/index.html'));
});

mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
  });
})



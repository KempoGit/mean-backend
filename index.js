
// .env configuration settings
require('dotenv').config();

// Is a backend web application framework for building RESTful APIs
const express = require('express');
//  CORS for the app
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Create express server
const app = express();
// JSON parsing
app.use(express.json());
// Create database connection
dbConnection();
// CORS configuration settings
app.use(cors());

// User & pass
const user = 'test_base';
const password = 'fzT4DYL1nuVkaqIR';

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));

// Server up
app.listen(process.env.PORT, () => {
    console.log(`😀 Server up on port ${process.env.PORT}`);
});
const express = require('express');
const app = express();

app.use(express.json());

// Middleware
app.use(require('./middleware/logger'));
// routes
app.use(require('./route/gorev'));
app.use(require('./route/calisan'));

module.exports = app;
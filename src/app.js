const app = require('express')();


// routes
app.use(require('./route/gorev'));

module.exports = app;
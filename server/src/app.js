//==> imports - built in
const express = require('express');
const path = require('path');

//imports - 3rdparties
const cors = require('cors');
const morgan = require('morgan');

// imports - custom
const api = require('./routes/api');


//App setup
const app = express();

///////////////////
// Middleware Chain
///////////////////

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api); //remember to update POSTMAN
//app.use('/v2', apiV2Router) // You could use this and create a new api version if needed.

// Using Routes

app.use('/*',(req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
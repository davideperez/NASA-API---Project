//==> imports - buildin
const express = require('express');
const path = require('path');

//imports - 3rdparties
const cors = require('cors');
const morgan = require('morgan');

// ==> imports - Routes
const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');


//App setup
const app = express();

// Middleware

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(morgan('combined'));

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

// Using Routes
app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

app.use('/*',(req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
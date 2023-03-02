///////////
// Imports
///////////

const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

///////////////////
// Router & Routes
///////////////////

const api = express.Router();

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

//////////
//Exports
//////////

module.exports = api;
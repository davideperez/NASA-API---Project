//////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////

const http = require('http');

require('dotenv').config(); //It should be called before the services and imports.

const app = require('./app');
const { mongoConnect } = require('./services/mongo')
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model')

//////////////////////////////////////////
// SERVER CONSTANTS SETUP
//////////////////////////////////////////

// server port
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

//////////////////////////////////////////
// SERVER Start-SETUP
//////////////////////////////////////////

console.log(`EL PORT ES: ${process.env.PORT}`)

async function startServer(){ // Este patron es muy util para cargar cosas antes de comience el server.
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();

    server.listen(PORT, () => { // abrimos el sv.
        console.log(`Listening on port: ${PORT}...`);
    })
};

//////////////////////////////////////////
// SERVER START!
//////////////////////////////////////////
startServer();
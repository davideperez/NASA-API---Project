//////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////

const http = require('http');
const app = require('./app');
const { mongoConnect } = require('./services/mongo')
const { loadPlanetsData } = require('./models/planets.model');
const { mongoConnect } = require('./services/mongo');

//////////////////////////////////////////
// SERVER CONSTANTS SETUP
//////////////////////////////////////////

// server port
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

//////////////////////////////////////////
// SERVER Start-SETUP
//////////////////////////////////////////

async function startServer(){ // Este patron es muy util para cargar cosas antes de comience el server.
    await mongoConnect();
    await loadPlanetsData();

    server.listen(PORT, () => { // abrimos el sv.
        console.log(`Listening on port: ${PORT}...`);
    })
};

//////////////////////////////////////////
// SERVER START!
//////////////////////////////////////////
startServer();
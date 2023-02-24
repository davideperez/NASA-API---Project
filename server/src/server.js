//////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////

const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

//////////////////////////////////////////
// SERVER CONSTANTS SETUP
//////////////////////////////////////////

// server port
const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:QIH6MdqvMjGZzPL4@nasacluster.ckp3kit.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

//////////////////////////////////////////
// MongoDB SETUP
//////////////////////////////////////////

mongoose.connection.once('open', () => {
    console.log('MongoDB conecction ready!');
});

// mongoose.connection.on is an event emmiter.
mongoose.connection.on('error', (err) => { 
    console.error(err);
});

//////////////////////////////////////////
// SERVER Start-SETUP
//////////////////////////////////////////

async function startServer(){ // Este patron es muy util para cargar cosas antes de comience el server.
    await mongoose.connect(MONGO_URL); // cargamos los datos de la db antes de que comience el sv.

    await loadPlanetsData();

    server.listen(PORT, () => { // abrimos el sv.
        console.log(`Listening on port: ${PORT}...`);
    });
};

//////////////////////////////////////////
// SERVER START!
//////////////////////////////////////////
startServer();
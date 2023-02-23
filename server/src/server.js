//Imports

const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');


//Server setup
const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:QIH6MdqvMjGZzPL4@nasacluster.ckp3kit.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);


//MongoDB Setup

mongoose.connection.once('open', () => {
    console.log('MongoDB conecction ready!');
});

mongoose.connection.on('error', (err) => { //this is an event emmiter.
    console.error(err);
});


// Server Start

async function startServer(){ // Este patron es muy util para cargar cosas antes de comience el server.
    await mongoose.connect(MONGO_URL); // cargamos los datos de la db antes de que comience el sv.

    await loadPlanetsData();

    server.listen(PORT, () => { // abrimos el sv.
        console.log(`Listening on port: ${PORT}...`);
    });
};


startServer();
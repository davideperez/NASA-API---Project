const mongoose = require('mongoose')

const MONGO_URL = 'mongodb+srv://nasa-api:QIH6MdqvMjGZzPL4@nasacluster.ckp3kit.mongodb.net/nasa?retryWrites=true&w=majority';

//////////////////////////////////////////
// MongoDB SETUP
//////////////////////////////////////////

// This was asked by cconsole by mongoose, i dont know what it does yet.
mongoose.set('strictQuery', false)

mongoose.connection.once('open', () => {
    console.log('MongoDB conecction ready!');
});

// mongoose.connection.on is an event emmiter.
mongoose.connection.on('error', (err) => { 
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL); // cargamos los datos de la db antes de que comience el sv.
}

async function mongoDisconnect() {
    await mongoose.disconnect() 
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};
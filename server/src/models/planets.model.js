// Build Ins Imports
const fs = require('fs');
const path = require('path');

// 3rd party Imports
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

// Receives any json exoplanet, filters and returns only the habitable ones.

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
};

/* ////
Receives the nasa csv exoplanets file, and streams it it through the .pipe() to the parse() that 
 converts each row of the csv to json, then .on() receives  
//// */
function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        const arrayOfPromises = []
        fs.createReadStream(path.join(__dirname, '..','..','data','kepler-data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (planetData) => {
                if (isHabitablePlanet(planetData)) { 
                    arrayOfPromises.push(savePlanet(planetData))
                }
            })
            .on('error', (err) =>{
                console.log(err);
                reject(err);
            })
            .on('end', async () =>{
                console.log("Reached End of Stream");
                Promise.allSettled(arrayOfPromises)
                    .then(async () => {
                        const countPlanetsFound =arrayOfPromises.length;
                        console.log(`${countPlanetsFound} habitable planets found!`);
                        resolve();
                    })
            });
        });
    };


//Receives each planet from the csv from nasa and adds upserts it to MongoDB.

async function savePlanet(planet) {
    try {
        await planets.updateOne({ // insert + update = upsert: inserts when our object does not already exists. if exists it updates it.
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name, 
        }, {
            upsert: true,
        })
    } catch(err){
        console.error(`Could not save planet ${err}`)
    }
}

async function getAllPlanets(){
    return await planets.find({},{
        '_id':0, '__v':0,
    });
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
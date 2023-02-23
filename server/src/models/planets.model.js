// Build Ins Imports
const fs = require('fs');
const path = require('path');

// 3rd party Imports
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const habitablePlanets = [];

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
};

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..','..','data','kepler-data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
           /*       TODO: Replace below create with upsert.   
                    await planets.create({
                        // insert + update = upsert: inserts when our object does not already exists. if exists it updates it.
                    keplerName: data.keplerName, 
                    })//habitablePlanets.push(data) */
                }
            })
            .on('error', (err) =>{
                console.log(err)
                reject(err)
            })
            .on('end', () =>{
                console.log(`${habitablePlanets.length} habitable planets found!`)
                resolve()
            });
        });
    };

async function getAllPlanets(){
    return await planets.find({});
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
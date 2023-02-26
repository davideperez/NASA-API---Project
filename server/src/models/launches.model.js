const launchesDataBase = require('./launches.mongo')

//const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explore IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Keppler 442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
};

saveLaunch(launch);

function existsLaunchWithId(launchId) {
    return launches.has(launchId)
};

async function getAllLaunches() {
    //{} using an empty object mongo know we want all the entrys. The second parameter is the projection
    // object. Were we define which properties dont want in our object, such as the mongodb id or version ob the
    //  object.
    return await launchesDataBase
        .find({}, {
            '_id': 0,
            '__v': 0
    })
};

async function saveLaunch(launch) {
    await launchesDataBase.updateOne({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
};

function addNewLaunch(launch){
    latestFlightNumber++
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            success: true,
            upcoming: true,
            customers: ['David', 'Yamila'],
            flightNumber: latestFlightNumber
    }));
};

function abortsLaunchById(launchId) {
    const aborted = launches.get(launchId)
    aborted.upcoming = false
    aborted.success = false
    
    return aborted
};

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortsLaunchById
};
const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explore IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Keppler 442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
    // CORE: checcks
    return await launchesDataBase.findOne({
        flightNumber: launchId,
    });
};

async function getLatestFlightNumber() {
    
    // CORE Process: DB QUERY, sorts de db and fetches the id of the last input. 
    const latestLunch = await launchesDataBase.findOne().sort('-flightNumber');
    
    // EXCEPTION: When there are no launches in the db.
    if(!latestLunch) {
        return DEFAULT_FLIGHT_NUMBER
    }
    
    // RETURNS latest flightnumber.
    return latestLunch.flightNumber;
}

async function getAllLaunches() {
    /* {} using an empty object in .find({},{}) mongo know we want all the entrys. The second object parameter
     is the projection object. There you can define which properties dont want in our object, 
     such as the mongodb id or version ob the object. */

    return await launchesDataBase
        .find({}, {
            '_id': 0,
            '__v': 0,
    });
};

/////////////////////////////////////
// Sube una entrada a la db de mongo
/////////////////////////////////////

async function saveLaunch(launch) {
    // VALIDACION de que existe el planeta del launch en la db de planetas.
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    // Se implementa el ERROR en caso de que el planeta target no existiese.
    if (!planet) {
        throw new Error('No matching planets was found.');
    };    

    // CORE de la funcion: se inserta el launch a la db en mongoDB.
    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}; 

//////////////////////////////////////////////////
// Suma un documento json a la a la db de mongo.
/////////////////////////////////////////////////

async function scheduleNewLaunch(launch) {
    // CALCULO: se calcula el id de los lanzamientos incrementando en 1 el id del ultimo lanzamiento. 
    const newFlightNumber = await getLatestFlightNumber() + 1;

    //CORE: Se construyen, aqui en el backend, los campos fijos del objeto launch, el resto los camos ya los asigno el front. 
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['David', 'Yamila'],
        flightNumber: newFlightNumber,
    })

    await saveLaunch(newLaunch)
}


async function abortsLaunchById(launchId) {
    const aborted = await launchesDataBase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    } )

    return aborted.modifiedCount === 1;
};

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortsLaunchById
};
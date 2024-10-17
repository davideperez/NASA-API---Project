const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios')

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

//////////////
// Functions
//////////////

async function populateLaunches() {
    console.log("Downloading launches data...")

    const response = await axios.post(SPACEX_API_URL, { //requests to spaceX API.
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })

    if(response.status != 200) {
        console.log('Problem dowloading launch data from SpaceX')
        throw new Error('Launch data download from spaceX, failed.')
    }

    const launchDocs = response.data.docs //.data is where axios puts the data comming from the body of our response, .docs is spaceX json structure.

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers =  payloads.flatMap((payload) => {
            return payload ['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'], 
            success: launchDoc['success'],
            customers,
        }

        console.log(`${launch.flightNumber} ${launch.mission}`)

        //populates Launches Collection.

        await saveLaunch(launch)
    }
}

async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    if(firstLaunch) {
        console.log('Launch data already loaded')
    } else {
        await populateLaunches();
    }
}

async function findLaunch(filter) {
    return await launchesDataBase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    // CORE: checcks
    return await findLaunch({ flightNumber: launchId });
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

///////////////////////////////////////////////////////////////////////
// Devuelve un .json que lista la cantidad de lanzamientos requeridos.
/////////////////////////////////////////////////////////////////////////

// READ

async function getAllLaunches(skip, limit) {
    /* {} using an empty object in .find({},{}) mongo know we want all the entrys. The second object parameter
     is the projection object. There you can define which properties dont want in our object, 
     such as the mongodb id or version ob the object. */

    return await launchesDataBase
        .find({}, { '_id': 0, '__v': 0})
        .sort({flightNumber: 1})
        .skip(skip)
        .limit(limit);
};


// CREATE / UPDATE
///////////////////////////////////////////////////////////////////////////////////////////////////
// Upsertea un lanzamiento en la DB. (solo eso)
/////////////////////////////////////////////////////////////////////////////////////////////////

async function saveLaunch(launch) {
    
    // CORE de la funcion: se inserta el launch a la db en mongoDB.
    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}; 

//////////////////////////////////////////////////////////////
// Crea un nuevo lanzamiento (pero valida el planeta)
//////////////////////////////////////////////////////////////

async function scheduleNewLaunch(launch) {

    // VALIDACION de que existe el planeta del launch en la db de planetas.
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    
    // Se implementa el ERROR en caso de que el planeta target no existiese.
    if (!planet) {
        throw new Error('No matching planets was found.');
    };    

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

// DEL
//////////////////////////////////////////////////////
/// Cambia el success a false en un obj lanzamiento.
//////////////////////////////////////////////////////

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
    loadLaunchData, 
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortsLaunchById,
};
const launches = new Map()

const latestFlightNumber = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explore IS1',
    launchDate: new Date('December 27, 2030'),
    destination: 'Keppler 442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch)

function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch){
    launches.set(latestFlightNumber, Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['David', 'Yamila'],
        flightNumber: latestFlightNumber
    }))
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
}
const { 
    getAllLaunches, 
    scheduleNewLaunch, 
    existsLaunchWithId, 
    abortsLaunchById, 
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches())
};

async function httpAddNewLaunch(req, res) {
    const launch = req.body

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property'
        });
    };

    launch.launchDate = new Date(launch.launchDate)
   // if (launch.launchDate.toString() === 'Invalid Date') {
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch date."
        });
    };

    await scheduleNewLaunch(launch)
        console.log(launch)
    return res.status(201).json(launch)
};

async function httpAbortLaunch(req, res){
    
    const launchId = Number(req.params.id);

    //FETCHES the launch id from the database.
    const existLaunch = await existsLaunchWithId(launchId);
    
    // VALIDATES if launch exists
    if(!existLaunch) {
        return res.status(404).json({
            error: "Launch not found."
        });
    };

    const aborted = await abortsLaunchById(launchId);

    if(!aborted) {
        return res.status(400).json({
            error: "Launch not aborted",
        });
    };
    
    // if launch does exists
    return res.status(200).json({
        ok: true,
    });    

};

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};
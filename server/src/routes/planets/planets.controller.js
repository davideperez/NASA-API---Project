const { getAllPlanets } = require('../../models/planets.model')

function httpGetAllPlanets(req, res) {
   return res.status(200).json(getAllPlanets())
  /*  este return no lo usa express pero, (y esto nolo entiendo
   bien )"Es para que asegurarnos que la funcion se ejecute 
   una sola vez, porque sino express ya tiene los headers alocados...
   o algo asi..." */
}

module.exports = {
    httpGetAllPlanets,
}
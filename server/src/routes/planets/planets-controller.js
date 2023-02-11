const { planets } = require('../../models/planets-model')

function getAllPlanets(req, res) {
   return res.status(200).json(planets) 
  /*  este return no lo usa express pero, (y esto nolo entiendo
   bien )"Es para que asegurarnos que la funcion se ejecute 
   una sola vez, porque sino express ya tiene los headers alocados...
   o algo asi..." */
}

module.exports = {
    getAllPlanets,
}
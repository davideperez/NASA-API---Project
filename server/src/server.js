//Imports
const http = require('http')
const app = require('./app')
const { loadPlanetsData } = require('./models/planets-model')

//Server setup
const PORT = process.env.PORT || 8000
const server = http.createServer(app)

async function startServer(){ // Este patron es muy util para cargar cosas antes de comience el server.
    await loadPlanetsData()

    server.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}...`)
    })
}

startServer()
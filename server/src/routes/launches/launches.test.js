const request = require('supertest')
const app = require('../../app')

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200) // expect(response.statusCode).toBe(200)
    })
})

describe('Test POST /launch', () => {
    const competeLaunchData = {
        mission: 'USS Enterprise',
        rocket: "AS1",
        target: "Kepler3232",
        launchDate: "January 4, 2039",
    }

    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: "AS1",
        target: "Kepler3232",
    }

    const launchDataWithInvalidDate = {
        mission: 'USS Enterprise',
        rocket: "AS1",
        target: "Kepler3232",
        launchDate: "zoot",
    }

    test('It should respond with 201 created', async () => {
        const response = await request(app)
            .post('/launches')
            .send(competeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201)
        
        const requestDate = new Date(competeLaunchData.launchDate).valueOf()
        const responseDate = new Date(response.body.launchDate).valueOf()
        
        expect(responseDate).toBe(requestDate)
        expect(response.body).toMatchObject(launchDataWithoutDate)
    })
    
    test('It should catch missing required properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400)
    
        expect(response.body).toStrictEqual({
            error: 'Missing required launch property',
        })
    })
    
    test('It should catch invalid dates', async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)

        expect(response.body).toStrictEqual({
            error: "Invalid launch date."
        })
    })
})
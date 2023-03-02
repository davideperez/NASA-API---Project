const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')

const API_VERSION = '/v1'

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });
    
    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
            .get(`${API_VERSION}/launches`)
            .expect('Content-Type', /json/)
            .expect(200); // expect(response.statusCode).toBe(200);
        });
    });
    
    describe('Test POST /launch', () => {
        const competeLaunchData = {
            mission: 'USS Enterprise',
            rocket: "AS1",
            target: "Kepler-62 f",
            launchDate: "January 4, 2039",
        }
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: "AS1",
            target: "Kepler-62 f",
        }
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: "AS1",
            target: "Kepler-62 f",
            launchDate: "zoot",
        }
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post(`${API_VERSION}/launches`)
                .send(competeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
            
            const requestDate = new Date(competeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
        
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post(`${API_VERSION}/launches`)
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
        
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
        });
        
        test('It should catch invalid dates', async () => {
            const response = await request(app)
            .post(`${API_VERSION}/launches`)
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: "Invalid launch date."
            });
        });
    });
})


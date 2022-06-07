const request = require('supertest');
const texts = require('./texts');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('TEST /api/v1/texts', () => {
    beforeAll( async () => { jest.setTimeout(8000);
        let connection = await mongoose.connect(process.env.DB_TEST_URL);
        console.log("Connected to the database");
    });
    afterAll( () => { mongoose.connection.close(true); });


    test('GET /api/v1/texts/random should respond with a random text', async () => {
        const response = await request(texts).get('/api/v1/texts/random');
        expect(response.statusCode).toBe(200);
    })
/* 
    let token = jwt.sign(
        {email: 'tester@test.com'},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:100000}
    ); */
})
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Text = require('../models/text');

describe('TEST /api/v1/texts', () => {
    let textRandomSpy;
    let textAllSpy;

    beforeAll( async () => { 
        
        textRandomSpy = jest.spyOn(Text, 'aggregate').mockImplementation((criteria) => {
            return [
                {
                    _id : 'objectId',
                    content : 'Lorem ipsum'
                }
            ];
        })

        textAllSpy = jest.spyOn(Text, 'find').mockImplementation((criteria) => {
            return [
                {
                    _id : 'objectId1',
                    content : 'Text 1',
                },
                {
                    _id : 'objectId2',
                    content : 'Text 2',
                },
                {
                    _id : 'objectId3',
                    content : 'Text 3',
                }
            ]
        })
    });
    afterAll( () => { textRandomSpy.mockRestore(); textAllSpy.mockRestore();});


    test('GET /api/v1/texts/random should respond with a random text', async () => {
        const response = await request(app).get('/api/v1/texts/random');
        expect(response.statusCode).toBe(200);
    })

    let token = jwt.sign(
        {email: 'g.brugna@gmail.com'},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:100000}
    );

/*     test('GET api/v1/texts/ with logged user', async () => {
        const response = await request(app).get('/api/v1/texts/').set('Cookie', [`auth=${token}`]);
        expect(response.statusCode).toBe(200);
    })
 */
    
})


describe('GET /api/v1/texts/random with no texts', () => {
    let textSpy;

    beforeAll( async () => { 
        textSpy = jest.spyOn(Text, 'aggregate').mockImplementation((criteria) => {
            return [];
        })
    });
    afterAll( () => { textSpy.mockRestore(); });


    test('GET /api/v1/texts/random should respond with a random text but there are no texts', async () => {
        const response = await request(app).get('/api/v1/texts/random');
        expect(response.statusCode).toBe(404);
    })        
})
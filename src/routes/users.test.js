const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');


describe('GET /api/v1/user/signup email already registered', () => {
    let userSpyFindOne;

    beforeAll( async () => { 
        userSpyFindOne = jest.spyOn(User, 'findOne').mockImplementation((criteria) => {
            return {
                email: 'mail@mail.com',
                password: 'password',
                username: 'pippo',
                average_wpm: '55',
                races_count: '12',
                precision: '74'
            };
        })
    });
    afterAll( () => { userSpyFindOne.mockRestore(); });


    test('POST /api/v1/user/signup should give error as user already exists', async () => {
        const response = await request(app).post('/api/v1/user/signup');
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({state: 'email-already-in-use'});
    })
})

describe('GET /api/v1/user/signup invalid and valid data submission', () => {
    let userSpyFindOne;

    beforeAll( async () => { 
        userSpyFindOne = jest.spyOn(User, 'findOne').mockImplementation((criteria) => {
            return null;
        });


    });
    afterAll( () => { userSpyFindOne.mockRestore(); });


    test('POST /api/v1/user/signup should give error as user already exists', async () => {
        const response = await request(app).post('/api/v1/user/signup').send({email:'invalidemail', username:'nome', password:'passwordlongerthan8chars'});
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({state: 'invalid-email'});
    })

    test('POST /api/v1/user/signup should give error as password is too short', async () => {
        const response = await request(app).post('/api/v1/user/signup').send({email:'valid@email.it', username:'nome', password:'lt8'});
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({state: 'psw-too-short'});
    })

    let token = jwt.sign(
        {email: 'valid@email.it'},
        process.env.ACCESS_TOKEN_SECRET
    );

    test('POST /api/v1/user/signup with valid data', async () => {
        const response = await request(app).post('/api/v1/user/signup').send({email:'valid@email.it', username:'nome', password:'longerThan8chars'});
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({state: 'successful', accessToken: token});
    })
})


describe('GET /api/v1/user/login email not found', () => {
    let userSpyFindOne;

    beforeAll( async () => { 
        userSpyFindOne = jest.spyOn(User, 'findOne').mockImplementation((criteria) => {
            return null
        })
    });
    afterAll( () => { userSpyFindOne.mockRestore(); });


    test('POST /api/v1/user/login should give error as email not found', async () => {
        const response = await request(app).post('/api/v1/user/login');
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({state: 'email-not-found'});
    })
})

describe('GET /api/v1/user/login wrong password and successful login', () => {
    let userSpyFindOne;

    beforeAll( async () => { 
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('password', salt);

        userSpyFindOne = jest.spyOn(User, 'findOne').mockImplementation((criteria) => {
            return {
                email: 'mail@mail.com',
                password: hashedPassword,
                username: 'pippo',
                average_wpm: '55',
                races_count: '12',
                precision: '74'
            };
        })
    });

    afterAll( () => { userSpyFindOne.mockRestore(); });


    test('POST /api/v1/user/login should give error as wrong password', async () => {
        const response = await request(app).post('/api/v1/user/login').send({email: 'mail@mail.com', password:'wrongpsw'});
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({state: 'wrong-psw'});
    })

    test('POST /api/v1/user/login successful login', async () => {
        const response = await request(app).post('/api/v1/user/login').send({email: 'mail@mail.com', password:'password'});
        expect(response.statusCode).toBe(200);
        //expect(Cookie.get('auth')).toBe(jwt.sign({email: 'mail@mail.com'}, process.env.ACCESS_TOKEN_SECRET));
        expect(response.body).toEqual({state: 'successful'});
    })
})
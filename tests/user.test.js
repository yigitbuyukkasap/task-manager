const request = require('supertest');
const app = require('../src/app');

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Yigit kuneri',
        email: 'qweqwe2@qweqwe.com',
        password: 'thisismypass'
    }).expect(201)
})
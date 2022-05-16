const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Ersan kuneri',
    email: 'ersankuneri@qweqwe.com',
    password: 'thisismypass',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Yigit kuneri',
        email: 'qweqwe2@qweqwe.com',
        password: 'thisismypass'
    }).expect(201)
})

test('should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'notmyPASSWORD'
    }).expect(400)
})

test('should get profile for user', async () => {
    await request(app).get('/users/me')
        .send()
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})

test('should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(200)
})

test('should  delete account for authenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})

test('should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(200)
})

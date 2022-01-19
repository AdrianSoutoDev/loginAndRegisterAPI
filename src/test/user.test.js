const { afterAll, beforeAll, afterEach } = require('@jest/globals')
const supertest = require('supertest')
const {app, server} = require('../../index')
const mongoose = require('mongoose')
const User = require('../models/user')
const api = supertest(app)

const { usernameExists, emailExists, findUserById} = require('../services/user_service');

const newUser = ( async () => {
    let user = new User({username: "adrian.souto", password: "somePassword", email: "adrian.souto@email.com", roles: []})
    return await user.save()
})

const notExistingID = () => '000000000000000000000000';

afterEach( async () => {
    await User.deleteMany({})
})

test('username not exist', async () => {
    expect(await usernameExists("notUsername")).toBe(false)
})

test('username exist', async () => {
    await newUser()
    expect(await usernameExists("adrian.souto")).toBe(true)
})

test('email not exist', async () => {
    expect(await emailExists("notEmail")).toBe(false)
})

test('email exist', async () => {
    await newUser()
    expect(await emailExists("adrian.souto@email.com")).toBe(true)
})

test('find user by id not found', async () => {
    await newUser()
    id = notExistingID()
    expect(await findUserById(id)).toBe(null)
})

test('find user by id', async () => {
    let user = await newUser()
    let userId = user.id
    let expected = (await findUserById(userId)).toJSON()
    expect(expected).toStrictEqual(user.toJSON())
})

afterAll(async () => {
    mongoose.disconnect()
    server.close()
})
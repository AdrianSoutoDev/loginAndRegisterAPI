const { afterAll, beforeAll, afterEach } = require('@jest/globals')
const supertest = require('supertest')
const {app, server} = require('../../index')
const mongoose = require('mongoose')
const User = require('../models/user')
const api = supertest(app)

const { usernameExists, emailExists, findUserById} = require('../services/user_service');
const notExistingID = () => '000000000000000000000000';
const existingID = () =>    '111111111111111111111111';

User.findOne = jest.fn()
User.findById = jest.fn()

beforeEach(() => {
    User.findOne.mockReset()
    User.findById.mockReset()
})

test('username not exist', async () => {
    User.findOne.mockReturnValueOnce(null)
    expect(await usernameExists("notUsername")).toBe(false)
})

test('username exist', async () => {
    User.findOne.mockReturnValueOnce({id: existingID(), username: "adrian.souto", password: "somePassword", email: "adrian.souto@email.com", roles: []})
    expect(await usernameExists("adrian.souto")).toBe(true)
})

test('email not exist', async () => {
    User.findOne.mockReturnValueOnce(null)
    expect(await emailExists("notEmail")).toBe(false)
})

test('email exist', async () => {
    User.findOne.mockReturnValueOnce({id: existingID(), username: "adrian.souto", password: "somePassword", email: "adrian.souto@email.com", roles: []})
    expect(await emailExists("adrian.souto@email.com")).toBe(true)
})

test('find user by id not found', async () => {
    User.findById.mockReturnValueOnce(null)
    id = notExistingID()
    expect(await findUserById(id)).toBe(null)
})

test('find user by id', async () => {
    user = new User( {id: existingID(), username: "adrian.souto", password: "somePassword", email: "adrian.souto@email.com", roles: []} )
    User.findById.mockReturnValueOnce(user)
    let expected = (await findUserById(user.id)).toJSON()
    expect(expected).toStrictEqual(user.toJSON())
})

afterAll(async () => {
    await mongoose.disconnect()
    server.close()
})
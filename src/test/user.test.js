const { afterAll, beforeEach } = require('@jest/globals')
const {server} = require('../../index')
const mongoose = require('mongoose')
const User = require('../models/user')
const userRepository = require('../repositories/user_repository');


const { usernameExists, emailExists, findUserById} = require('../services/user_service');
const notExistingID = () => '000000000000000000000000';
const existingID = () =>    '111111111111111111111111';

userRepository.findUserByUsername = jest.fn()
userRepository.findUserByEmail = jest.fn()
userRepository.findUserById = jest.fn()

beforeEach(() => {
    User.deleteMany({})
    jest.resetAllMocks();
})

test('username not exist', async () => {
    
userRepository.findUserByUsername.mockReturnValueOnce(null)
    expect(await usernameExists("notUsername")).toBe(false)
})

test('username exist', async () => {
    
userRepository.findUserByUsername.mockReturnValueOnce({id: existingID(), username: "adrian.souto", password: "somePassword", email: "adrian.souto@email.com", roles: []})
    expect(await usernameExists("adrian.souto")).toBe(true)
})

test('email not exist', async () => {
    userRepository.findUserByEmail.mockReturnValueOnce(null)
    expect(await emailExists("notEmail")).toBe(false)
})

test('email exist', async () => {
    userRepository.findUserByEmail.mockReturnValueOnce({id: existingID(), username: "adrian.souto", password: "somePassword", email: "adrian.souto@email.com", roles: []})
    expect(await emailExists("adrian.souto@email.com")).toBe(true)
})

test('find user by id not found', async () => {
    userRepository.findUserById.mockReturnValueOnce(null)
    id = notExistingID()
    expect(await findUserById(id)).toBe(null)
})

test('find user by id', async () => {
    user = new User( {id: existingID(), username: "adrian.souto", password: "somePassword", email: "adrian.souto@email.com", roles: []} )
    userRepository.findUserById.mockReturnValueOnce(user)
    let expected = (await findUserById(user.id)).toJSON()
    expect(expected).toStrictEqual(user.toJSON())
})

afterAll(async () => {
    await mongoose.disconnect()
    server.close()
})
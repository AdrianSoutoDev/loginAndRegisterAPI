const { afterAll, beforeEach } = require('@jest/globals')
const { server } = require('../../index')
const mongoose = require('mongoose')
const User = require('../models/user')
const userRepositoryMock = require('../repositories/user_repository')

const { usernameExists, emailExists, findUserById } = require('../services/user_service')
const notExistingID = () => '000000000000000000000000'
const existingID = () => '111111111111111111111111'

jest.mock('../repositories/user_repository')

beforeEach(() => {
  jest.resetAllMocks()
})

test('username not exist', async () => {
  userRepositoryMock.findUserByUsername.mockReturnValueOnce(null)
  expect(await usernameExists('notUsername')).toBe(false)
})

test('username exist', async () => {
  userRepositoryMock.findUserByUsername.mockReturnValueOnce({ id: existingID(), username: 'adrian.souto', password: 'somePassword', email: 'adrian.souto@email.com', roles: [] })
  expect(await usernameExists('adrian.souto')).toBe(true)
})

test('email not exist', async () => {
  userRepositoryMock.findUserByEmail.mockReturnValueOnce(null)
  expect(await emailExists('notEmail')).toBe(false)
})

test('email exist', async () => {
  userRepositoryMock.findUserByEmail.mockReturnValueOnce({ id: existingID(), username: 'adrian.souto', password: 'somePassword', email: 'adrian.souto@email.com', roles: [] })
  expect(await emailExists('adrian.souto@email.com')).toBe(true)
})

test('find user by id not found', async () => {
  userRepositoryMock.findUserById.mockReturnValueOnce(null)
  const id = notExistingID()
  expect(await findUserById(id)).toBe(null)
})

test('find user by id', async () => {
  const user = new User({ id: existingID(), username: 'adrian.souto', password: 'somePassword', email: 'adrian.souto@email.com', roles: [] })
  userRepositoryMock.findUserById.mockReturnValueOnce(user)
  const expected = (await findUserById(user.id)).toJSON()
  expect(expected).toStrictEqual(user.toJSON())
})

afterAll(async () => {
  await mongoose.disconnect()
  server.close()
})

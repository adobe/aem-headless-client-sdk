/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { AEMHeadless, ErrorCodes } = require('../../src')
// /////////////////////////////////////////////
const queryString = `
{
  adventureList {
    items {
      _path
    }
  }
}
`
const persistedName = 'wknd/persist-query-name'
let sdk = {}

beforeEach(() => {
  sdk = new AEMHeadless({
    endpoint: 'endpoint/path.gql',
    serviceURL: 'http://localhost',
    auth: ['user', 'pass']
  })

  fetch.resetMocks()
  fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      data: 'test'
    })
  })
})

test('API: persistQuery API Success', () => {
  // check success response
  const promise = sdk.persistQuery(queryString, `${persistedName}-${Date.now()}`)
  return expect(promise).resolves.toBeTruthy()
})

test('API: invalid serviceURL', () => {
  const serviceURL = 'invalid url path'
  const config = {
    serviceURL
  }
  sdk = new AEMHeadless(config)
  const promise = sdk.runQuery(queryString)
  return expect(promise).rejects.toThrow(`Invalid URL/path: ${serviceURL}`)
})

test('API: persistQuery API Error', () => {
  fetch.mockRejectedValue({
    ok: false
  })
  // check error response
  const promise = sdk.persistQuery(queryString, persistedName)
  return expect(promise).rejects.toThrow()
})

test('API: listPersistedQueries API Success', () => {
  const promise = sdk.listPersistedQueries()
  return expect(promise).resolves.toBeTruthy()
})

test('API: runQuery API Success', () => {
  // check success response
  const promise = sdk.runQuery(queryString)
  return expect(promise).resolves.toBeTruthy()
})

test('API: runQuery with variables API Success', () => {
  // check success response
  const promise = sdk.runQuery({ query: queryString, variables: { name: 'Ado' } })
  return expect(promise).resolves.toBeTruthy()
})

test('API: runQuery API Error', () => {
  fetch.mockRejectedValue({
    ok: false
  })
  // check error response
  const promise = sdk.runQuery()
  return expect(promise).rejects.toThrow()
})

test('API: runPersistedQuery API Success', () => {
  // check success response
  const promise = sdk.runPersistedQuery(persistedName)
  return expect(promise).resolves.toBeTruthy()
})

test('API: runPersistedQuery with variables API Success', () => {
  // check success response
  const promise = sdk.runPersistedQuery(persistedName, { name: 'test' }, { method: 'POST' })
  return expect(promise).resolves.toBeTruthy()
})

test('API: runPersistedQuery GET with variables API Success', () => {
  // check success response
  const promise = sdk.runPersistedQuery(persistedName, { name: 'test' })
  expect(fetch).toHaveBeenCalledWith(`http://localhost/graphql/execute.json/${persistedName}%3Bname%3Dtest;`, expect.anything(), expect.anything())
  return expect(promise).resolves.toBeTruthy()
})

test('API: runPersistedQuery GET with two variables API Success', () => {
  // check success response
  const promise = sdk.runPersistedQuery(persistedName, { name: 'test', locale: 'en' })
  expect(fetch).toHaveBeenCalledWith(`http://localhost/graphql/execute.json/${persistedName}%3Bname%3Dtest%3Blocale%3Den;`, expect.anything(), expect.anything())
  return expect(promise).resolves.toBeTruthy()
})

test('API: runPersistedQuery GET with no variables API Success', () => {
  // check success response
  const promise = sdk.runPersistedQuery(persistedName)
  expect(fetch).toHaveBeenCalledWith(`http://localhost/graphql/execute.json/${persistedName}`, expect.anything(), expect.anything())
  return expect(promise).resolves.toBeTruthy()
})

test('API: runPersistedQuery GET with no variables API Success and empty variables', () => {
  const promise = sdk.runPersistedQuery(persistedName, {})
  expect(fetch).toHaveBeenCalledWith(`http://localhost/graphql/execute.json/${persistedName}`, expect.anything(), expect.anything())
  return expect(promise).resolves.toBeTruthy()
})

test('API: runPersistedQuery API Error', () => {
  fetch.mockRejectedValue({
    ok: false
  })
  // check error response
  const promise = sdk.runPersistedQuery('/test')
  return expect(promise).rejects.toThrow()
})
// #181 2.2 Response error: JSON parsed - valid error defined in API response
test('API: custom error message', () => {
  fetch.mockResolvedValue({
    ok: false,
    json: async () => ({
      error: {
        message: 'API custom error'
      }
    })
  })
  // check error response
  const promise = sdk.runPersistedQuery('/test')
  return expect(promise).rejects.toThrow(ErrorCodes.API_ERROR)
})
// #175 2.3 Response error: Couldn't parse JSON - no error defined in API response
test('API: Failed response JSON parsing error', () => {
  const JsonError = Error('JSON parse error')
  fetch.mockResolvedValue({
    ok: false,
    json: async () => {
      throw JsonError
    }
  })

  const promise = sdk.runPersistedQuery('/test')
  return expect(promise).rejects.toThrow(ErrorCodes.RESPONSE_ERROR)
})
// #191 3.2. Response ok: Data error - Couldn't parse the JSON from OK response
test('API: Successful response JSON parsing error', () => {
  const JsonError = Error('JSON parse error')
  fetch.mockResolvedValue({
    ok: true,
    json: async () => {
      throw JsonError
    }
  })

  const promise = sdk.runPersistedQuery('/test')
  return expect(promise).rejects.toThrow(ErrorCodes.RESPONSE_ERROR)
})

test('ERROR: Error helper', () => {
  fetch.mockResolvedValue({
    ok: false
  })

  const promise = sdk.runPersistedQuery('/test')
  return promise.catch(e => {
    // eslint-disable-next-line
    return expect(e.toJSON()).toHaveProperty('message', e.message)
  })
})

test('API: auth as a token', () => {
  const config = {
    serviceURL: 'http://localhost',
    auth: 'token'
  }
  sdk = new AEMHeadless(config)
  const promise = sdk.runQuery(queryString)
  return expect(promise).resolves.toBeTruthy()
})

test('API: additional request options', () => {
  const config = {}
  sdk = new AEMHeadless(config)
  const promise = sdk.runQuery(queryString, { method: 'GET' })
  return expect(promise).resolves.toStrictEqual({ data: 'test' })
})

test('API: runQuery with custom headers API Success', () => {
  const config = { headers: { 'global-header': 'global-value' } }
  sdk = new AEMHeadless(config)
  const promise = sdk.runQuery(queryString, { headers: { 'custom-header': 'custom-value' } })
  return expect(promise).resolves.toBeTruthy()
})

test('API: params validation', () => {
  fetch.mockResolvedValue({
    ok: false,
    json: async () => ({
      errors: [{
        message: 'API custom error'
      }]
    })
  })
  // check error response
  const promise = sdk.runQuery('/test')
  return expect(promise).rejects.toThrow(ErrorCodes.API_ERROR)
})

test('API: custom API error missing', () => {
  fetch.mockResolvedValue({
    ok: false,
    json: async () => ({})
  })

  const promise = sdk.runPersistedQuery('/test')
  return promise.catch(e => {
    // eslint-disable-next-line
    return expect(e.toJSON()).toHaveProperty('message', e.message)
  })
})

test('API: multiple API custom errors', () => {
  sdk = new AEMHeadless({
    endpoint: {},
    serviceURL: {}
  })
  // check error response
  const promise = sdk.runPersistedQuery('/test')
  return expect(promise).rejects.toThrow('Invalid URL/path:')
})

describe('runPaginatedQuery', () => {
  const mockModel = 'mockModel'
  const mockFields = 'mockFields'
  const mockConfig = { pageSize: 10 }
  const mockArgs = {}
  const mockOptions = {}
  const mockRetryOptions = {}

  it('should throw an error if model is missing', async () => {
    const gen = await sdk.runPaginatedQuery(null, mockFields, mockConfig, mockArgs, mockOptions, mockRetryOptions)
    await expect(gen.next()).rejects.toThrow(ErrorCodes.INVALID_PARAM)
  })

  it('should throw an error if fields are missing', async () => {
    const gen = await sdk.runPaginatedQuery(mockModel, null, mockConfig, mockArgs, mockOptions, mockRetryOptions)
    await expect(gen.next()).rejects.toThrow(ErrorCodes.INVALID_PARAM)
  })

  it('should yield the filtered data', async () => {
    const mockData = { id: '1', name: 'foo' }
    fetch.resetMocks()
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          mockModelPaginated: {
            edges: [
              { node: mockData }
            ],
            pageInfo: {}
          }
        }
      })
    })

    const gen = await sdk.runPaginatedQuery(mockModel, mockFields, mockConfig, mockArgs, mockOptions, mockRetryOptions)
    const { value } = await gen.next()

    expect(value.data).toEqual([mockData])
  })

  it('should yield done true and value false, at the last iteration', async () => {
    const mockData = { id: '1', name: 'foo' }
    fetch.resetMocks()
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          mockModelPaginated: {
            edges: [
              { node: mockData }
            ],
            pageInfo: {
              hasNextPage: false
            }
          }
        }
      })
    })

    const gen = await sdk.runPaginatedQuery(mockModel, mockFields, mockConfig, mockArgs, mockOptions, mockRetryOptions)
    const result = await gen.next()

    expect(result.done).toBeFalsy()
    expect(result.value.data).toEqual([mockData])

    const { done, value } = await gen.next()

    expect(done).toBeTruthy()
    expect(value).toBeFalsy()
  })

  it('should yield only first item - cursor query', async () => {
    const mockData = [
      { id: '1', name: 'foo' },
      { id: '2', name: 'bar' }
    ]
    fetch.resetMocks()
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          mockModelPaginated: {
            edges: [
              { node: mockData[0] }
            ],
            pageInfo: {
              hasNextPage: true
            }
          }
        }
      })
    })

    const gen = await sdk.runPaginatedQuery(mockModel, mockFields, mockConfig, { first: 1 }, mockOptions, mockRetryOptions)
    const result = await gen.next()

    expect(result).toEqual({ done: false, value: { data: [mockData[0]], hasNext: true } })
  })

  it('should yield only first item - offset query', async () => {
    const mockData = [
      { id: '1', name: 'foo' },
      { id: '2', name: 'bar' }
    ]
    fetch.resetMocks()
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          mockModelList: {
            items: [
              mockData[0]
            ]
          }
        }
      })
    })

    const gen = await sdk.runPaginatedQuery('mockModel', mockFields, { useLimitOffset: true }, { limit: 1 }, mockOptions, mockRetryOptions)
    const { value } = await gen.next()

    expect(value.data).toEqual([mockData[0]])
  })

  it('should yield item - path query', async () => {
    const mockData = { id: '1', name: 'foo' }
    fetch.resetMocks()
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          mockModelByPath: {
            item: mockData
          }
        }
      })
    })

    const gen = await sdk.runPaginatedQuery(mockModel, mockFields, {}, { _path: 'path' }, mockOptions, mockRetryOptions)
    const { value } = await gen.next()

    expect(value.data).toEqual(mockData)
  })

  it('should update pagingArgs', async () => {
    const mockData = { id: '1', name: 'foo' }
    fetch.resetMocks()
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          mockModel2Paginated: {
            edges: [
              { node: mockData },
              { node: mockData }
            ],
            pageInfo: {
              hasNextPage: true
            }
          }
        }
      })
    })

    const gen = await sdk.runPaginatedQuery('mockModel2', mockFields, { pageSize: 1 }, { limit: 1 }, mockOptions, mockRetryOptions)
    const result = await gen.next()

    expect(result.done).toBeFalsy()
    expect(result.value.data).toEqual([mockData, mockData])

    const { done, value } = await gen.next()

    expect(done).toBeFalsy()
    expect(value.data).toEqual([mockData, mockData])
  })
})

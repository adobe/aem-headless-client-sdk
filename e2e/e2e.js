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

const path = require('path')

// load .env values in the e2e folder, if any
require('dotenv').config({ path: path.join(__dirname, '.env') })

const { AEMHeadless } = require('../src')

const { AEM_TOKEN, AEM_USER = 'admin', AEM_PASS = 'admin', AEM_HOST_URI = 'http://localhost:4502', AEM_GRAPHQL_ENDPOINT = 'content/graphql/global/endpoint.json' } = process.env

const queryString = `
{
  adventureList {
    items {
      _path
    }
  }
}
`
let sdk = {}
const persistedName = 'wknd/persist-query-name'

beforeAll(() => {
  sdk = new AEMHeadless(AEM_GRAPHQL_ENDPOINT, AEM_HOST_URI, AEM_TOKEN || [AEM_USER, AEM_PASS])
})

test('e2e test saveQuery API Success', () => {
  // check success response
  const promise = sdk.saveQuery(queryString, `${persistedName}-${Date.now()}`)
  return expect(promise).resolves.toBeTruthy()
})

test('e2e test saveQuery API Error', () => {
  // check error response
  const promise = sdk.saveQuery(queryString, persistedName)
  return expect(promise).rejects.toThrow()
})

test('e2e test listQueries API Success', () => {
  const promise = sdk.listQueries()
  return expect(promise).resolves.toBeTruthy()
})

test('e2e test postQuery API Success', () => {
  // check success response
  const promise = sdk.postQuery(queryString)
  return expect(promise).resolves.toBeTruthy()
})

test('e2e test postQuery API Error', () => {
  // check error response
  const promise = sdk.postQuery()
  return expect(promise).rejects.toThrow()
})

test('e2e test getQuery API Success', () => {
  // check success response
  const promise = sdk.getQuery(persistedName)
  return expect(promise).resolves.toBeTruthy()
})

test('e2e test getQuery API Error', () => {
  // check error response
  const promise = sdk.getQuery('/test')
  return expect(promise).rejects.toThrow()
})

/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const ErrorCodes = require('./utils/SDKErrors').codes
const { AEM_GRAPHQL_ACTIONS, AEM_GRAPHQL_TYPES } = require('./utils/config')
const { graphQLQueryBuilder, getQueryType } = require('./utils/GraphQLQueryBuilder')
const { __getUrl, __getPath, __getDomain, __validateUrl, __getFetch, __getAuthHeader } = require('./utils/utils')
const { REQUEST_ERROR, RESPONSE_ERROR, API_ERROR, INVALID_PARAM } = ErrorCodes

/**
 * This class provides methods to call AEM GraphQL APIs.
 * Before calling any method initialize the instance
 * with GraphQL endpoint, GraphQL serviceURL and auth if needed
 */
class AEMHeadless {
  /**
   * Constructor.
   *
   * If param is a string, it's treated as AEM server URL, default GraphQL endpoint is used.
   * For granular params, use config object
   *
   * @param {string|object} config - Configuration object, or AEM server URL string
   * @param {string} [config.serviceURL] - AEM server URL
   * @param {string} [config.endpoint] - GraphQL endpoint
   * @param {(string|Array)} [config.auth] - Bearer token string or [user,pass] pair array
   * @param {object} [config.headers] - header { name: value, name: value, ... }
   * @param {object} [config.fetch] - custom Fetch instance
   */
  constructor (config) {
    let endpoint = AEM_GRAPHQL_ACTIONS.endpoint
    let serviceURL = AEM_GRAPHQL_ACTIONS.serviceURL

    if (typeof config === 'string') {
      serviceURL = config
    } else {
      serviceURL = config.serviceURL || serviceURL
      endpoint = config.endpoint || endpoint
      this.auth = config.auth
      this.headers = config.headers
    }

    this.serviceURL = __getDomain(serviceURL)
    this.endpoint = __getPath(endpoint)
    this.fetch = __getFetch(config.fetch)
  }

  /**
   * Returns a Promise that resolves with a POST request JSON data.
   *
   * @param {string|object} body - the query string or an object with query (and optionally variables) as a property
   * @param {object} [options={}] - additional POST request options
   * @param {object} [retryOptions={}] - retry options for @adobe/aio-lib-core-networking
   * @returns {Promise<any>} - the response body wrapped inside a Promise
   */
  async runQuery (body, options = {}, retryOptions = {}) {
    const postBody = typeof body === 'object' ? body : { query: body }
    return this.__handleRequest(this.endpoint, JSON.stringify(postBody), options, retryOptions)
  }

  /**
   * Returns a Promise that resolves with a PUT request JSON data.
   *
   * @param {string} query - the query string
   * @param {string} path - AEM path to save query, format: configuration_name/endpoint_name
   * @param {object} [options={}] - additional PUT request options
   * @param {object} [retryOptions={}] - retry options for @adobe/aio-lib-core-networking
   * @returns {Promise<any>} - the response body wrapped inside a Promise
   */
  async persistQuery (query, path, options = {}, retryOptions = {}) {
    const url = `${AEM_GRAPHQL_ACTIONS.persist}/${path}`
    return this.__handleRequest(url, query, { method: 'PUT', ...options }, retryOptions)
  }

  /**
   * Returns a Promise that resolves with a GET request JSON data.
   *
   * @param {object} [options={}] - additional GET request options
   * @param {object} [retryOptions={}] - retry options for @adobe/aio-lib-core-networking
   * @returns {Promise<any>} - the response body wrapped inside a Promise
   */
  async listPersistedQueries (options = {}, retryOptions = {}) {
    const url = `${AEM_GRAPHQL_ACTIONS.list}`
    return this.__handleRequest(url, '', { method: 'GET', ...options }, retryOptions)
  }

  /**
   * Returns a Promise that resolves with a GET request JSON data.
   *
   * @param {string} path - AEM path for persisted query, format: configuration_name/endpoint_name
   * @param {object} [variables={}] - query variables
   * @param {object} [options={}] - additional GET request options
   * @param {object} [retryOptions={}] - retry options for @adobe/aio-lib-core-networking
   * @returns {Promise<any>} - the response body wrapped inside a Promise
   */

  async runPersistedQuery (path, variables = {}, options = {}, retryOptions = {}) {
    const method = (options.method || 'GET').toUpperCase()
    let body = ''
    let variablesString = encodeURIComponent(Object.keys(variables).map(key => {
      const val = (typeof variables[key] === 'string') ? variables[key] : JSON.stringify(variables[key])
      return `;${key}=${val}`
    }).join(''))

    if (method === 'GET' && variablesString) {
      variablesString += ';'
    }

    if (method === 'POST') {
      body = JSON.stringify({ variables })
      variablesString = ''
    }

    const url = `${AEM_GRAPHQL_ACTIONS.execute}/${path}${variablesString}`
    return this.__handleRequest(url, body, { method, ...options }, retryOptions)
  }

  /**
   * Returns a Generator Function.
   *
   * @generator
   * @param {string} model - contentFragment model name
   * @param {string} fields - The query string for item fields
   * @param {ModelConfig} [config={}] - Pagination config
   * @param {ModelArgs} [args={}] - Query arguments
   * @param {object} [options={}] - additional POST request options
   * @param {object} [retryOptions={}] - retry options for @adobe/aio-lib-core-networking
   * @yields {null | Promise<object | Array>} - the response items wrapped inside a Promise
   */
  async * runPaginatedQuery (model, fields, config = {}, args = {}, options, retryOptions) {
    if (!model || !fields) {
      throw new INVALID_PARAM({
        sdkDetails: {
          serviceURL: this.serviceURL
        },
        messageValues: 'Required param missing: @param {string} fields - query string for item fields'
      })
    }

    let isInitial = true
    let hasNext = true
    let after = args.after || ''
    const limit = args.limit
    let pagingArgs = args
    while (hasNext) {
      const offset = pagingArgs.offset || 0
      if (!isInitial) {
        pagingArgs = this.__updatePagingArgs(args, { offset, limit, after })
      }

      isInitial = false
      const filteredData = await this.runModelQuery(model, fields, config, pagingArgs, options, retryOptions)

      hasNext = filteredData.hasNext
      after = filteredData.endCursor

      yield {
        data: filteredData.data,
        hasNext
      }
    }
  }

  /**
   * Returns a Promise that resolves with a filtered POST request JSON data.
   *
   * @param {string} model - contentFragment model name
   * @param {string} fields - The query string for item fields
   * @param {ModelConfig} [config={}] - Pagination config
   * @param {ModelArgs} [args={}] - Query arguments
   * @param {object} [options={}] - additional POST request options
   * @param {object} [retryOptions={}] - retry options for @adobe/aio-lib-core-networking
   * @returns {Promise<any>} - the response data wrapped inside a Promise
   */
  async runModelQuery (model, fields, config, args, options, retryOptions) {
    if (!model || !fields) {
      throw new INVALID_PARAM({
        sdkDetails: {
          serviceURL: this.serviceURL
        },
        messageValues: 'Required param missing: @param {string} fields - query string for item fields'
      })
    }

    const size = args.first || args.limit
    const { query, type } = this.buildQuery(model, fields, config, args)
    const { data } = await this.runQuery(query, options, retryOptions)
    let filteredData = {}
    try {
      filteredData = this.__filterData(model, type, data, size)
    } catch (e) {
      throw new API_ERROR({
        sdkDetails: {
          serviceURL: this.serviceURL
        },
        messageValues: `Error while filtering response data. ${e.message}`
      })
    }

    return filteredData
  }

  /**
   * Builds a GraphQL query string for the given parameters.
   *
   * @param {string} model - contentFragment Model Name
   * @param {string} fields - The query string for item fields
   * @param {ModelConfig} [config={}] - Pagination config
   * @param {ModelArgs} [args={}] - Query arguments
   * @returns {QueryBuilderResult} - object with The GraphQL query string and type
   */
  buildQuery (model, fields, config, args = {}) {
    return graphQLQueryBuilder(model, fields, config, args)
  }

  /**
   * Returns the updated paging arguments based on the current arguments and the response data.
   *
   * @private
   * @param {object} args - The current paging arguments.
   * @param {object} data - Current page arguments.
   * @param {string} data.after - The cursor to start after.
   * @param {number} data.offset - The offset to start from.
   * @param {number} [data.limit = 10] - The maximum number of items to return per page.
   * @returns {object} The updated paging arguments.
   */
  __updatePagingArgs (args = {}, { after, offset, limit = 10 }) {
    const queryType = getQueryType(args)
    const pagingArgs = { ...args }
    if (queryType === AEM_GRAPHQL_TYPES.LIST) {
      pagingArgs.offset = offset + limit
    }

    if (queryType === AEM_GRAPHQL_TYPES.PAGINATED) {
      pagingArgs.after = after
    }

    return pagingArgs
  }

  /**
   * Returns items list and paging info.
   *
   * @private
   * @param {string} model - contentFragment model name
   * @param {string} type - model query type: byPath, List, Paginated
   * @param {object} data - raw response data
   * @param {number} size - page size
   * @returns {object} - object with filtered data and paging info
   */
  __filterData (model, type, data, size = 0) {
    let response
    let filteredData
    let hasNext
    let endCursor
    let len
    switch (type) {
      case AEM_GRAPHQL_TYPES.BY_PATH:
        filteredData = data[`${model}${type}`].item
        hasNext = false
        break
      case AEM_GRAPHQL_TYPES.PAGINATED:
        response = data[`${model}${type}`]
        filteredData = response.edges.map(item => item.node)
        len = (filteredData && filteredData.length) || 0
        hasNext = response.pageInfo.hasNextPage && len > 0 && len >= size
        endCursor = response.pageInfo.endCursor
        break
      default:
        filteredData = data[`${model}${type}`].items
        len = (filteredData && filteredData.length) || 0
        hasNext = len > 0 && len >= size
    }

    return {
      data: filteredData,
      hasNext,
      endCursor
    }
  }

  /**
   * Returns an object for Request options
   *
   * @private
   * @param {string} [body] - Request body (the query string)
   * @param {object} [options] Additional Request options
   * @returns {object} the Request options object
   */
  __getRequestOptions (body, options) {
    const { method = 'POST' } = options

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (this.headers) {
      requestOptions.headers = {
        ...this.headers,
        ...requestOptions.headers
      }
    }

    if (this.auth) {
      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: __getAuthHeader(this.auth)
      }
      requestOptions.credentials = 'include'
    }

    return {
      method,
      ...body ? { body } : {},
      ...requestOptions,
      ...options
    }
  }

  /**
   * Returns a Promise that resolves with a PUT request JSON data.
   *
   * @private
   * @param {string} endpoint - Request endpoint
   * @param {string} [body=''] - Request body (the query string)
   * @param {object} [options={}] - Request options
   * @param {object} [retryOptions={}] - retry options for @adobe/aio-lib-core-networking
   * @returns {Promise<any>} the response body wrapped inside a Promise
   */
  async __handleRequest (endpoint, body, options, retryOptions) {
    const requestOptions = this.__getRequestOptions(body, options)
    const url = __getUrl(this.serviceURL, endpoint)
    __validateUrl(url)

    let response
    // 1. Handle Request
    try {
      response = await this.fetch(url, requestOptions, retryOptions)
    } catch (error) {
      // 1.1 Request error: general
      throw new REQUEST_ERROR({
        sdkDetails: {
          serviceURL: this.serviceURL,
          endpoint
        },
        messageValues: error.message
      })
    }

    let apiError
    const sdkDetails = {
      serviceURL: this.serviceURL,
      endpoint,
      status: response.status
    }
    // 2. Handle Response error
    if (!response.ok) {
      try {
        // 2.1 Check if custom error is returned
        apiError = await response.json()
      } catch (error) {
        // 2.3 Response error: Couldn't parse JSON - no error defined in API response
        throw new RESPONSE_ERROR({
          sdkDetails,
          messageValues: error.message
        })
      }
    }

    if (apiError) {
      // 2.2 Response error: JSON parsed - valid error defined in API response
      throw new API_ERROR({
        sdkDetails,
        messageValues: apiError
      })
    }
    // 3. Handle ok response
    let data
    try {
      data = await response.json()
    } catch (error) {
      // 3.2. Response ok: Data error - Couldn't parse the JSON from OK response
      throw new RESPONSE_ERROR({
        sdkDetails,
        messageValues: error.message
      })
    }
    // 3.2. Response ok: containing errors info
    if (data && data.errors) {
      throw new RESPONSE_ERROR({
        sdkDetails,
        messageValues: data.errors.map((error) => error.message).join('. ')
      })
    }

    return data
  }
}

module.exports = AEMHeadless
module.exports.AEMHeadless = AEMHeadless
module.exports.ErrorCodes = ErrorCodes

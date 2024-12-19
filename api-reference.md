<!--
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->
# AEM HEADLESS SDK API Reference

## Classes

<dl>
<dt><a href="#AEMHeadless">AEMHeadless</a></dt>
<dd><p>This class provides methods to call AEM GraphQL APIs.
Before calling any method initialize the instance
with GraphQL endpoint, GraphQL serviceURL and auth if needed</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Model">Model</a> : <code>object</code></dt>
<dd><p>GraphQL Model type</p>
</dd>
<dt><a href="#ModelResult">ModelResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ModelResults">ModelResults</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ModelEdge">ModelEdge</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#PageInfo">PageInfo</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ModelConnection">ModelConnection</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ModelByPathArgs">ModelByPathArgs</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ModelListArgs">ModelListArgs</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ModelPaginatedArgs">ModelPaginatedArgs</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ModelArgs">ModelArgs</a> : <code><a href="#ModelByPathArgs">ModelByPathArgs</a></code> | <code><a href="#ModelListArgs">ModelListArgs</a></code> | <code><a href="#ModelPaginatedArgs">ModelPaginatedArgs</a></code></dt>
<dd></dd>
<dt><a href="#QueryBuilderResult">QueryBuilderResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ModelConfig">ModelConfig</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="AEMHeadless"></a>

## AEMHeadless
This class provides methods to call AEM GraphQL APIs.
Before calling any method initialize the instance
with GraphQL endpoint, GraphQL serviceURL and auth if needed

**Kind**: global class  

* [AEMHeadless](#AEMHeadless)
    * [new AEMHeadless(config)](#new_AEMHeadless_new)
    * [.runQuery(body, [options], [retryOptions])](#AEMHeadless+runQuery) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.persistQuery(query, path, [options], [retryOptions])](#AEMHeadless+persistQuery) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.listPersistedQueries([options], [retryOptions])](#AEMHeadless+listPersistedQueries) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.runPersistedQuery(path, [variables], [options], [retryOptions])](#AEMHeadless+runPersistedQuery) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.runPaginatedQuery(model, fields, [config], [args], [options], [retryOptions])](#AEMHeadless+runPaginatedQuery)
    * [.runModelQuery(model, fields, [config], [args], [options], [retryOptions])](#AEMHeadless+runModelQuery) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.buildQuery(model, fields, [config], [args])](#AEMHeadless+buildQuery) ⇒ [<code>QueryBuilderResult</code>](#QueryBuilderResult)

<a name="new_AEMHeadless_new"></a>

### new AEMHeadless(config)
Constructor.

If param is a string, it's treated as AEM server URL, default GraphQL endpoint is used.
For granular params, use config object

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>config</td><td><code>string</code> | <code>object</code></td><td><p>Configuration object, or AEM server URL string</p>
</td>
    </tr><tr>
    <td>[config.serviceURL]</td><td><code>string</code></td><td><p>AEM server URL</p>
</td>
    </tr><tr>
    <td>[config.endpoint]</td><td><code>string</code></td><td><p>GraphQL endpoint</p>
</td>
    </tr><tr>
    <td>[config.auth]</td><td><code>string</code> | <code>Array</code></td><td><p>Bearer token string or [user,pass] pair array</p>
</td>
    </tr><tr>
    <td>[config.headers]</td><td><code>object</code></td><td><p>header { name: value, name: value, ... }</p>
</td>
    </tr><tr>
    <td>[config.fetch]</td><td><code>object</code></td><td><p>custom Fetch instance</p>
</td>
    </tr>  </tbody>
</table>

<a name="AEMHeadless+runQuery"></a>

### aemHeadless.runQuery(body, [options], [retryOptions]) ⇒ <code>Promise.&lt;any&gt;</code>
Returns a Promise that resolves with a POST request JSON data.

**Kind**: instance method of [<code>AEMHeadless</code>](#AEMHeadless)  
**Returns**: <code>Promise.&lt;any&gt;</code> - - the response body wrapped inside a Promise  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>body</td><td><code>string</code> | <code>object</code></td><td></td><td><p>the query string or an object with query (and optionally variables) as a property</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>object</code></td><td><code>{}</code></td><td><p>additional POST request options</p>
</td>
    </tr><tr>
    <td>[retryOptions]</td><td><code>object</code></td><td><code>{}</code></td><td><p>retry options for @adobe/aio-lib-core-networking</p>
</td>
    </tr>  </tbody>
</table>

<a name="AEMHeadless+persistQuery"></a>

### aemHeadless.persistQuery(query, path, [options], [retryOptions]) ⇒ <code>Promise.&lt;any&gt;</code>
Returns a Promise that resolves with a PUT request JSON data.

**Kind**: instance method of [<code>AEMHeadless</code>](#AEMHeadless)  
**Returns**: <code>Promise.&lt;any&gt;</code> - - the response body wrapped inside a Promise  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>the query string</p>
</td>
    </tr><tr>
    <td>path</td><td><code>string</code></td><td></td><td><p>AEM path to save query, format: configuration_name/endpoint_name</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>object</code></td><td><code>{}</code></td><td><p>additional PUT request options</p>
</td>
    </tr><tr>
    <td>[retryOptions]</td><td><code>object</code></td><td><code>{}</code></td><td><p>retry options for @adobe/aio-lib-core-networking</p>
</td>
    </tr>  </tbody>
</table>

<a name="AEMHeadless+listPersistedQueries"></a>

### aemHeadless.listPersistedQueries([options], [retryOptions]) ⇒ <code>Promise.&lt;any&gt;</code>
Returns a Promise that resolves with a GET request JSON data.

**Kind**: instance method of [<code>AEMHeadless</code>](#AEMHeadless)  
**Returns**: <code>Promise.&lt;any&gt;</code> - - the response body wrapped inside a Promise  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[options]</td><td><code>object</code></td><td><code>{}</code></td><td><p>additional GET request options</p>
</td>
    </tr><tr>
    <td>[retryOptions]</td><td><code>object</code></td><td><code>{}</code></td><td><p>retry options for @adobe/aio-lib-core-networking</p>
</td>
    </tr>  </tbody>
</table>

<a name="AEMHeadless+runPersistedQuery"></a>

### aemHeadless.runPersistedQuery(path, [variables], [options], [retryOptions]) ⇒ <code>Promise.&lt;any&gt;</code>
Returns a Promise that resolves with a GET request JSON data.

**Kind**: instance method of [<code>AEMHeadless</code>](#AEMHeadless)  
**Returns**: <code>Promise.&lt;any&gt;</code> - - the response body wrapped inside a Promise  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>path</td><td><code>string</code></td><td></td><td><p>AEM path for persisted query, format: configuration_name/endpoint_name</p>
</td>
    </tr><tr>
    <td>[variables]</td><td><code>object</code></td><td><code>{}</code></td><td><p>query variables</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>object</code></td><td><code>{}</code></td><td><p>additional GET request options</p>
</td>
    </tr><tr>
    <td>[retryOptions]</td><td><code>object</code></td><td><code>{}</code></td><td><p>retry options for @adobe/aio-lib-core-networking</p>
</td>
    </tr>  </tbody>
</table>

<a name="AEMHeadless+runPaginatedQuery"></a>

### aemHeadless.runPaginatedQuery(model, fields, [config], [args], [options], [retryOptions])
Returns a Generator Function.

**Kind**: instance method of [<code>AEMHeadless</code>](#AEMHeadless)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>model</td><td><code>string</code></td><td></td><td><p>contentFragment model name</p>
</td>
    </tr><tr>
    <td>fields</td><td><code>string</code></td><td></td><td><p>The query string for item fields</p>
</td>
    </tr><tr>
    <td>[config]</td><td><code><a href="#ModelConfig">ModelConfig</a></code></td><td><code>{}</code></td><td><p>Pagination config</p>
</td>
    </tr><tr>
    <td>[args]</td><td><code><a href="#ModelArgs">ModelArgs</a></code></td><td><code>{}</code></td><td><p>Query arguments</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>object</code></td><td><code>{}</code></td><td><p>additional POST request options</p>
</td>
    </tr><tr>
    <td>[retryOptions]</td><td><code>object</code></td><td><code>{}</code></td><td><p>retry options for @adobe/aio-lib-core-networking</p>
</td>
    </tr>  </tbody>
</table>

<a name="AEMHeadless+runModelQuery"></a>

### aemHeadless.runModelQuery(model, fields, [config], [args], [options], [retryOptions]) ⇒ <code>Promise.&lt;any&gt;</code>
Returns a Promise that resolves with a filtered POST request JSON data.

**Kind**: instance method of [<code>AEMHeadless</code>](#AEMHeadless)  
**Returns**: <code>Promise.&lt;any&gt;</code> - - the response data wrapped inside a Promise  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>model</td><td><code>string</code></td><td></td><td><p>contentFragment model name</p>
</td>
    </tr><tr>
    <td>fields</td><td><code>string</code></td><td></td><td><p>The query string for item fields</p>
</td>
    </tr><tr>
    <td>[config]</td><td><code><a href="#ModelConfig">ModelConfig</a></code></td><td><code>{}</code></td><td><p>Pagination config</p>
</td>
    </tr><tr>
    <td>[args]</td><td><code><a href="#ModelArgs">ModelArgs</a></code></td><td><code>{}</code></td><td><p>Query arguments</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>object</code></td><td><code>{}</code></td><td><p>additional POST request options</p>
</td>
    </tr><tr>
    <td>[retryOptions]</td><td><code>object</code></td><td><code>{}</code></td><td><p>retry options for @adobe/aio-lib-core-networking</p>
</td>
    </tr>  </tbody>
</table>

<a name="AEMHeadless+buildQuery"></a>

### aemHeadless.buildQuery(model, fields, [config], [args]) ⇒ [<code>QueryBuilderResult</code>](#QueryBuilderResult)
Builds a GraphQL query string for the given parameters.

**Kind**: instance method of [<code>AEMHeadless</code>](#AEMHeadless)  
**Returns**: [<code>QueryBuilderResult</code>](#QueryBuilderResult) - - object with The GraphQL query string and type  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>model</td><td><code>string</code></td><td></td><td><p>contentFragment Model Name</p>
</td>
    </tr><tr>
    <td>fields</td><td><code>string</code></td><td></td><td><p>The query string for item fields</p>
</td>
    </tr><tr>
    <td>[config]</td><td><code><a href="#ModelConfig">ModelConfig</a></code></td><td><code>{}</code></td><td><p>Pagination config</p>
</td>
    </tr><tr>
    <td>[args]</td><td><code><a href="#ModelArgs">ModelArgs</a></code></td><td><code>{}</code></td><td><p>Query arguments</p>
</td>
    </tr>  </tbody>
</table>

<a name="Model"></a>

## Model : <code>object</code>
GraphQL Model type

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>*</td><td><code>any</code></td><td><p>model properties</p>
</td>
    </tr>  </tbody>
</table>

<a name="ModelResult"></a>

## ModelResult : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>item</td><td><code><a href="#Model">Model</a></code></td><td><p>response item</p>
</td>
    </tr>  </tbody>
</table>

<a name="ModelResults"></a>

## ModelResults : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>items</td><td><code><a href="#Model">Array.&lt;Model&gt;</a></code></td><td><p>response items</p>
</td>
    </tr>  </tbody>
</table>

<a name="ModelEdge"></a>

## ModelEdge : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>cursor</td><td><code>string</code></td><td><p>item cursor</p>
</td>
    </tr><tr>
    <td>node</td><td><code><a href="#Model">Model</a></code></td><td><p>item node</p>
</td>
    </tr>  </tbody>
</table>

<a name="PageInfo"></a>

## PageInfo : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>endCursor</td><td><code>string</code></td><td><p>endCursor</p>
</td>
    </tr><tr>
    <td>hasNextPage</td><td><code>boolean</code></td><td><p>hasNextPage</p>
</td>
    </tr><tr>
    <td>hasPreviousPage</td><td><code>boolean</code></td><td><p>hasPreviousPage</p>
</td>
    </tr><tr>
    <td>startCursor</td><td><code>string</code></td><td><p>startCursor</p>
</td>
    </tr>  </tbody>
</table>

<a name="ModelConnection"></a>

## ModelConnection : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>edges</td><td><code><a href="#ModelEdge">Array.&lt;ModelEdge&gt;</a></code></td><td><p>edges</p>
</td>
    </tr><tr>
    <td>pageInfo</td><td><code><a href="#PageInfo">PageInfo</a></code></td><td><p>pageInfo</p>
</td>
    </tr>  </tbody>
</table>

<a name="ModelByPathArgs"></a>

## ModelByPathArgs : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>_path</td><td><code>string</code></td><td><p>contentFragment path</p>
</td>
    </tr><tr>
    <td>variation</td><td><code>string</code></td><td><p>contentFragment variation</p>
</td>
    </tr>  </tbody>
</table>

<a name="ModelListArgs"></a>

## ModelListArgs : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[_locale]</td><td><code>string</code></td><td><p>contentFragment locale</p>
</td>
    </tr><tr>
    <td>[variation]</td><td><code>string</code></td><td><p>contentFragment variation</p>
</td>
    </tr><tr>
    <td>[filter]</td><td><code>object</code></td><td><p>list filter options</p>
</td>
    </tr><tr>
    <td>[sort]</td><td><code>string</code></td><td><p>list sort options</p>
</td>
    </tr><tr>
    <td>[offset]</td><td><code>number</code></td><td><p>list offset</p>
</td>
    </tr><tr>
    <td>[limit]</td><td><code>number</code></td><td><p>list limit</p>
</td>
    </tr>  </tbody>
</table>

<a name="ModelPaginatedArgs"></a>

## ModelPaginatedArgs : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[_locale]</td><td><code>string</code></td><td><p>contentFragment locale</p>
</td>
    </tr><tr>
    <td>[variation]</td><td><code>string</code></td><td><p>contentFragment variation</p>
</td>
    </tr><tr>
    <td>[filter]</td><td><code>object</code></td><td><p>list filter options</p>
</td>
    </tr><tr>
    <td>[sort]</td><td><code>string</code></td><td><p>list sort options</p>
</td>
    </tr><tr>
    <td>[first]</td><td><code>number</code></td><td><p>number of list items</p>
</td>
    </tr><tr>
    <td>[after]</td><td><code>string</code></td><td><p>list starting cursor</p>
</td>
    </tr>  </tbody>
</table>

<a name="ModelArgs"></a>

## ModelArgs : [<code>ModelByPathArgs</code>](#ModelByPathArgs) \| [<code>ModelListArgs</code>](#ModelListArgs) \| [<code>ModelPaginatedArgs</code>](#ModelPaginatedArgs)
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>*</td><td><code>any</code></td><td><p>placeholder property</p>
</td>
    </tr>  </tbody>
</table>

<a name="QueryBuilderResult"></a>

## QueryBuilderResult : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>type</td><td><code>string</code></td><td><p>Query type</p>
</td>
    </tr><tr>
    <td>query</td><td><code>QueryString</code></td><td><p>Query string</p>
</td>
    </tr>  </tbody>
</table>

<a name="ModelConfig"></a>

## ModelConfig : <code>object</code>
**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[pageSize]</td><td><code>number</code></td><td><code>10</code></td><td><p>page size</p>
</td>
    </tr><tr>
    <td>[after]</td><td><code>string</code> | <code>number</code></td><td></td><td><p>starting cursor or offset</p>
</td>
    </tr><tr>
    <td>[useLimitOffset]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>use offset pagination</p>
</td>
    </tr>  </tbody>
</table>


import "whatwg-fetch"
import "url-search-params-polyfill"
import { reduceIt, asArray } from "./func"

export function mergeQSParams(params, qs) {
  if (qs.length) {
    // Merge query string params with pathParams
    const searchParams = new URLSearchParams(
      qs.match(/^\?/) ? qs.substr(1) : qs // remove leading ?
    )
    return reduceIt(
      searchParams,
      (mergedParams, [key, value]) => {
        if (key in mergedParams) {
          mergedParams[key] = asArray(mergedParams[key]).concat(value)
        } else {
          mergedParams[key] = value
        }
        return mergedParams
      },
      params
    )
  }
  return params
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json()
  }
  console.warn("Non JSON response!") // eslint-disable-line
  return Promise.resolve({})
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  return parseJSON(response).then(RespJSON => {
    const error = new Error(response.statusText || `${response.status} error`)
    error.response = response
    error.json = RespJSON
    throw error
  })
}

export function urlParamify(params = {}) {
  const urlValues = Object.keys(params).reduce((urlParams, k) => {
    if (Array.isArray(params[k])) {
      params[k].forEach(value => urlParams.append(k, value))
    } else {
      urlParams.append(k, params[k])
    }
    return urlParams
  }, new URLSearchParams())

  return urlValues.toString()
}

export function formDataify(params = {}) {
  return Object.keys(params).reduce((data, k) => {
    if (Array.isArray(params[k])) {
      params[k].forEach(value => data.append(`${k}[]`, value))
    } else {
      data.append(k, params[k])
    }
    return data
  }, new FormData())
}

export function mergeQueryStrings(qs1, qs2) {
  qs1 = qs1.match(/^\?/) ? qs1.substr(1) : qs1 // remove leading ?
  qs2 = qs2.match(/^\?/) ? qs2.substr(1) : qs2 // remove leading ?

  if (!qs1) {
    return `?${qs2}`
  }
  if (!qs2) {
    return `?${qs1}`
  }

  const qs1Params = new URLSearchParams(qs1)
  const qs2Params = new URLSearchParams(qs2)
  const mergedParams = reduceIt(
    qs2Params,
    (merged, [name, value]) => {
      merged.set(name, value)
      return merged
    },
    qs1Params
  )

  return `?${mergedParams.toString()}`
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
}

// @flow

let XMLHttpRequest
if (typeof(window) != 'undefined') {
  XMLHttpRequest = window.XMLHttpRequest
} else {
  XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
}

const TIMEOUT_MILLIS = 2000

class Ajax {
  _send(method: string, url: string, json: string | null) {
    const x = new XMLHttpRequest()

    let canceled = false
    return new Promise(function(resolve, reject) {
      const timeout = setTimeout(function() {
        canceled = true
        x.abort()
        reject(new Error(`Timeout after ${TIMEOUT_MILLIS} ms`))
      }, TIMEOUT_MILLIS)

      x.open(method, url, true) // 3rd parameter: async=true
      x.onreadystatechange = function() {
        if (x.readyState === 4) {
          if (canceled) {
            return
          }
          clearTimeout(timeout)
          if (x.status !== 200) {
            reject(new Error(`Status ${x.status} from ${method} ${url}`))
          } else {
            resolve(x.responseText)
          }
        }
      }

      if (method === 'POST' || method === 'PUT') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      }
      x.send(json)
    })
  }

  get(url: string, data: any) {
    return this._send('GET', url + '?' + JSON.stringify(data), null)
  }

  post(url: string, data: any) {
    return this._send('POST', url, JSON.stringify(data))
  }
}

module.exports = Ajax

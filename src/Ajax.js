// @flow

let XMLHttpRequest
if (typeof(window) != 'undefined') {
  XMLHttpRequest = window.XMLHttpRequest
} else {
  XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
}

const TIMEOUT_MILLIS = 2000

class Ajax {
  _send(method: string, url: string, json: string | null): Promise<any> {
    const x = new XMLHttpRequest()

    let canceled = false
    return new Promise(function(resolve, reject) {
      const timeout = setTimeout(function() {
        canceled = true
        x.abort()
        reject(new Error(`Timeout after ${TIMEOUT_MILLIS} ms`))
      }, TIMEOUT_MILLIS)

      console.log(`${method} to ${url}...`)
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
            if (x.getResponseHeader('Content-Type') === "application/json") {
              try {
                resolve(JSON.parse(x.responseText))
              } catch (e) {
                if (e instanceof SyntaxError) {
                  reject(e)
                } else {
                  throw e
                }
              }
            } else {
              resolve(x.responseText)
            }
          }
        }
      }

      if (method === 'POST' || method === 'PUT') {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      }
      x.send(json)
    })
  }

  get(url: string, data: any): Promise<any> {
    return this._send('GET', url + '?' + JSON.stringify(data), null)
  }

  post(url: string, data: any): Promise<any> {
    return this._send('POST', url, JSON.stringify(data))
  }
}

module.exports = Ajax

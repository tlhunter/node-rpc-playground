#!/usr/bin/env node

const http = require('http')
const util = require('util')

const SERVER_PORT = 9092
const OPERATIONS = 100000

let start = null

function randomInteger (min, max) {
  return min + Math.floor(Math.random() * (max - min))
}

let opts = {port: SERVER_PORT, host: 'localhost'}

start = Date.now()
console.log('starting timer', start)

const request = util.promisify((method, params, id, callback) => {
  let data = ''
  http.get({
    hostname: opts.host,
    port: opts.port,
    path: '/sum/' + params.join('/'),
    agent: false  // create a new agent just for this one request
  }, (res) => {
    res.on('data', (d) => {
      data += d
    })
    res.on('end', () => {
      let result = JSON.parse(data)
      callback(null, result)
    })
  })
})

startBenchmark()
.then(() => {
  console.log('done.')

  let total = Date.now() - start
  console.log('operation took', total, 'ms')

  let opsPerSec = OPERATIONS / (total / 1000)
  console.log('able to perform', opsPerSec.toFixed(3), 'operations per second')
})

async function startBenchmark (client) {
  for (let i = 1; i <= OPERATIONS; i++) {
    let params = [randomInteger(1, 100), randomInteger(1, 100)]
    let result = await request('sum', params, i)
    // console.log(result)
    // console.log('sum', params, 'result', result)
  }
}

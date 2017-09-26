#!/usr/bin/env node

const net = require('net')
const util = require('util')

const mp = require('msgpack5')()

const SERVER_PORT = 9091
const OPERATIONS = 100000

// Pool of callback handlers for expected RCP results
// Should only contain 0 || 1 item as we do work sequentially
const pool = new Map()

let start = null

function randomInteger (min, max) {
  return min + Math.floor(Math.random() * (max - min))
}

function generateRequest (method, params, id) {
  let payload = {
    jsonrpc: '2.0',
    method,
    params,
    id
  }

  return mp.encode(payload)
}

let opts = {port: SERVER_PORT, host: 'localhost'}

const client = net.createConnection(opts, async () => {
  start = Date.now()
  console.log('connected to server, starting timer', start)

  await startBenchmark(client)

  console.log('done. gonna hang up...')
  client.end()

  let total = Date.now() - start
  console.log('operation took', total, 'ms')

  let opsPerSec = OPERATIONS / (total / 1000)
  console.log('able to perform', opsPerSec.toFixed(3), 'operations per second')
})

client.on('data', (data) => {
  let object = mp.decode(data)
  // console.log('received data', object)

  if (!pool.has(object.id)) {
    return void console.error('NO CALLBACK REGISTERED FOR RPC ID', object.id)
  }

  let cb = pool.get(object.id)
  pool.delete(object.id)
  return void cb(null, object)
})

client.on('end', () => {
  console.log('disconnected from server')
  console.log('still have', pool.size, 'entries in pool (should be 0)')
})

const request = util.promisify((method, params, id, callback) => {
  if (pool.has(id)) {
    return void setImmediate(() => {
      callback(Error(`Already handling request #${id}`))
    })
  }

  pool.set(id, callback)

  let payload = generateRequest(method, params, id)
  client.write(payload)
})

async function startBenchmark (client) {
  for (let i = 1; i <= OPERATIONS; i++) {
    let params = [randomInteger(1, 100), randomInteger(1, 100)]
    let result = await request('sum', params, i)
    // console.log('sum', params, 'result', result)
  }
}

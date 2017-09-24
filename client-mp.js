#!/usr/bin/env node

const net = require('net')
const mp = require('msgpack5')()

const SERVER_PORT = 9091

let rpcId = 0

function generateRequest (method, params) {
  let payload = {
    jsonrpc: '2.0',
    method,
    params,
    id: ++rpcId
  }

  return mp.encode(payload)
}

let opts = {port: SERVER_PORT, host: 'localhost'}

const client = net.createConnection(opts, () => {
  console.log('connected to server')
  let payload = generateRequest('sum', [1, 2, 3])
  console.log('payload', payload.toString('hex'))
  client.write(payload)
})

client.on('data', (data) => {
  let object = mp.decode(data)
  console.log('received data', object)
  console.log('gonna hang up...')
  client.end()
})

client.on('end', () => {
  console.log('disconnected from server')
})

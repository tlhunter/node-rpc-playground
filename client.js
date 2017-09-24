#!/usr/bin/env node

const net = require('net')

const SERVER_PORT = 9090

let rpcId = 0

function generateRequest (method, params) {
  let payload = {
    jsonrpc: '2.0',
    method,
    params,
    id: rpcId++
  }

  return `${JSON.stringify(payload)}\r\n`
}

let opts = {port: SERVER_PORT, host: 'localhost'}

const client = net.createConnection(opts, () => {
  console.log('connected to server')
  let payload = generateRequest('sum', [1, 2, 3])
  client.write(payload)
})

client.on('data', (data) => {
  let string = data.toString()
  let object = JSON.parse(string)
  console.log('received data', object)
  console.log('gonna hang up...')
  client.end()
})

client.on('end', () => {
  console.log('disconnected from server')
})

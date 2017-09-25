#!/usr/bin/env node

const net = require('net')
const mp = require('msgpack5')()

const PORT = 9091

const rpc = {
  sum (numbers, callback) {
    let total = 0
    for (let i = 0; i < numbers.length; i++) {
      total += numbers[i]
    }

    // Pretend to be slow async operation
    setImmediate(() => {
      callback(null, total)
    })
  }
}

function generateError (id, code, message) {
  let payload = {
    jsonrpc: '2.0',
    error: {
      code,
      message
    },
    id
  }

  return mp.encode(payload)
}

function generateSuccess (id, result) {
  let payload = {
    jsonrpc: '2.0',
    result,
    id
  }

  return mp.encode(payload)
}

const server = net.createServer((client) => {
  console.log('client connected')
  client.on('data', (data) => {
    let object = mp.decode(data)
    // console.log('new data', object)
    if (!(object.method in rpc)) {
      return void client.write(generateError(
        object.id,
        -32601,
        'Method not found'
      ))
    }

    rpc[object.method](object.params, (error, result) => {
      if (error) {
        return void client.write(generateError(
          object.id,
          -32001,
          String(error)
        ))
      }
      client.write(generateSuccess(object.id, result))
    })
  })

  client.on('end', () => {
    console.log('client disconnected')
  })
})

server.on('error', (error) => {
  console.log(`server had an error: ${error}`)
})

server.listen(PORT, () => {
  console.log('listening at', server.address())
})

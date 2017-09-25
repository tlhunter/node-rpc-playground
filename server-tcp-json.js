#!/usr/bin/env node

const net = require('net')

const PORT = 9090

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

  return JSON.stringify(payload)
}

function generateSuccess (id, result) {
  let payload = {
    jsonrpc: '2.0',
    result,
    id
  }

  return `${JSON.stringify(payload)}\r\n`
}

const server = net.createServer((client) => {
  console.log('client connected')
  client.on('data', (data) => {
    let string = data.toString()
    let object = JSON.parse(string)
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

  client.on('error', (error) => {
    console.error(`client had an error: ${error}`)
  })
})

server.on('error', (error) => {
  console.error(`server had an error: ${error}`)
})

server.listen(PORT, () => {
  console.log('listening at', server.address())
})

#!/usr/bin/env node

const http = require('http')

const PORT = 9092

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

const server = http.createServer((req, res) => {
  // console.log('client connected')
  res.setHeader('Content-Type', 'application/json')
  let [method, ...args] = req.url.split('/').splice(1)
  args = args.map(Number)

  if (!(method in rpc)) {
    res.statusCode = 400
    return void res.end(JSON.stringify({error: 'method not found'}))
  }

  rpc[method](args, (error, result) => {
    if (error) {
      res.statusCode = 500
      return void res.end(JSON.stringify({error: String(error)}))
    }
    res.end(JSON.stringify({result}))
  })
  // console.log('client disconnected')
})

server.listen(PORT, () => {
  console.log('listening at', server.address())
})

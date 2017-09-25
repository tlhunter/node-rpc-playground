# Node RPC Playground

Experimenting with JSON RPC over TCP

## Benchmark

There is some overhead when converting JSON into MessagePack. However the network payload is reduced. My hypothesis is that this tradeoff means JSON is better when working with short distances, and MP is better when working with long distances.

When performing TCP benchmarks the timer starts after a connection is established (so no DNS stuff). We then send send a message to the server, the server processes the message, and sends a result back to us. This happens 1,000 times and we calculate overall operations per second.

| Scenario    | Localhost | SF -> Freemont | SF -> London |
|-------------|----------:|---------------:|-------------:|
| _Node_      | v8.5.0    | v8.5.0         | v8.5.0       |
| _Ping_      | 0.087 ms  | 5.264 ms       | 250.8 ms     |
| HTTP + JSON | ??? o/s   | ??? o/s        | ??? o/s      |
| HTTP + MP   | ??? o/s   | ??? o/s        | ??? o/s      |
| TCP + JSON  | 9.900 o/s | 5.372 o/s      | 3.664 o/s    |
| TCP + MP    | 9.846 o/s | 5.111 o/s      | 3.704 o/s    |

So far I do not trust these results. Only being able to send, process, and receive 10 ops/sec on the same machine is a bit concerning. This is consistent both on my Linux development machine and my Linux VPS. I suspect there's an inefficiency in my code.

## TODO

* Send messages in parallel batches
* Send larger messages
* Benchmark using HTTP
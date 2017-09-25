# Node RPC Playground

Experimenting with JSON RPC over TCP

## Benchmark

There is some overhead when converting JSON into MessagePack. However the network payload is reduced. My hypothesis is that this tradeoff means JSON is better when working with short distances, and MP is better when working with long distances.

When performing TCP benchmarks the timer starts after a connection is established (so no DNS stuff). We then send send a message to the server, the server processes the message, and sends a result back to us. This happens 1,000 times and we calculate overall operations per second.

| Scenario    | Localhost | SF -> Freemont | SF -> London |
|-------------|----------:|---------------:|-------------:|
| _Node_      | v8.5.0    | v8.5.0         | v8.5.0       |
| _Ping_      | 0.065 ms  | 5.264 ms       | 250.8 ms     |
| HTTP + JSON | ??? o/s   | ??? o/s        | ??? o/s      |
| HTTP + MP   | ??? o/s   | ??? o/s        | ??? o/s      |
| TCP + JSON  | 15886 o/s | 194.185 o/s    | 4.383 o/s    |
| TCP + MP    | 8004 o/s  | 177.167 o/s    | 4.364 o/s    |

According to these results, at no point is MessagePack with Node.js faster than using JSON. As network latency gets worse and worse we approach having the two operations take the same amount of time. It will probably take a larger payload for the scales to tip in MessagePack's favor.

## TODO

* Send messages in parallel batches
* Send larger messages
* Benchmark using HTTP

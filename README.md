# Node RPC Playground

Experimenting with JSON RPC over TCP

## Benchmark

There is some overhead when converting JSON into MessagePack. However the network payload is reduced. My hypothesis is that this tradeoff means JSON is better when working with short distances, and MP is better when working with long distances.

When performing TCP benchmarks the timer starts after a connection is established (so no DNS stuff). We then send send a message to the server, the server processes the message, and sends a result back to us. This happens 1,000 times and we calculate overall operations per second.

No modules are used (e.g. for a web server), with the exception of `msgpack5`, which seems to be the only maintained MessagePack module.

* Request Size JSON: ~60 bytes
* Response Size JSON: ~40 bytes
* Request Size MessagePack: 40 bytes
* Response Size MessagePack: ~27 bytes

HTTP is included as a baseline. Don't interpret these results as "Node can do X at y ops per second" as the code has not been optimized. Instead think of it as "This method is X times as fast as Y".

| Scenario    | Localhost         | SF -> Freemont    | SF -> London      |
|-------------|------------------:|------------------:|------------------:|
| _Node_      | v8.5.0            | v8.5.0            | v8.5.0            |
| _Ping_      | 0.065 ms          | 4.364 ms          | 142.5 ms          |
| HTTP + JSON | 3268 o/s          | 65.40 o/s         | 3.479 o/s         |
| TCP + JSON  | 15886 o/s (4.9x)  | 239.6 o/s (3.7x)  | 6.963 o/s (2.0x)  |
| TCP + MP    | 8004 o/s (2.4x)   | 203.9 o/s (3.1x)  | 6.902 o/s (2.0x)  |

## Conclusion

According to these results, at no point is MessagePack with Node.js faster than using JSON. As network latency gets worse and worse we approach having the two operations take the same amount of time. It will probably take a larger payload for the scales to tip in MessagePack's favor.

## TODO

* Send messages in parallel batches
* Send larger messages
* Benchmark using HTTP2
* Benchmark using HTTP + Gzip

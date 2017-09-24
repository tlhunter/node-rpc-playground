# Node RPC Playground

Experimenting with JSON RPC over TCP

## Benchmark

There is some overhead when converting JSON into MessagePack. However the network payload is reduced. My hypothesis is that this tradeoff means JSON is better when working with short distances, and MP is better when working with long distances.

| Scenario    | Localhost | SF -> Freemont | SF -> London |
|-------------|----------:|---------------:|-------------:|
| _Node_      | v8.5.0    | v8.5.0         | v8.5.0       |
| _Ping_      | 0.087 ms  | 6.473 ms       | 135.548 ms   |
| HTTP + JSON | 0 o/s     | 0 o/s          | 0 o/s        |
| HTTP + MP   | 0 o/s     | 0 o/s          | 0 o/s        |
| TCP + JSON  | 9.714 o/s | 0 o/s          | 0 o/s        |
| TCP + MP    | 9.832 o/s | 0 o/s          | 0 o/s        |
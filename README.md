# pidfile

Copyright (c) 2017 Michael Welter <michael@yammm.com>

## About

Helper module for creating, locking, writing and closing proper pidfiles.
I use for [monit](https://mmonit.com/wiki/Monit/FAQ#pidfile) based monitoring
of my Node servers.

The pidfile created will be unlinked when exiting if process.on("exit") is emitted.

## Install

    $ npm install --save pidfile

## Usage

```javascript

// Setup signal handlers so process exit event can be triggered
[ "SIGINT", "SIGTERM" ].forEach(signal => process.on(signal, process.exit));

require("pidfile")("/var/run/example.pid");
```

## Debugging

NODE_DEBUG=pidfile
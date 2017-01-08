"use strict";

const pidfile = module.filename.slice(0, -2) + "pid";

require("../mkpidfile")(pidfile);

// Setup signal handlers so process exit event can be triggered
[ "SIGINT", "SIGTERM", "SIGHUP" ].forEach(signal => process.on(signal, process.exit));

// Terminate with core dump
process.on("SIGQUIT", process.abort);

// Begin reading from stdin so the process does not exit.
process.stdin.resume();

console.log("Press Control-D to exit.");
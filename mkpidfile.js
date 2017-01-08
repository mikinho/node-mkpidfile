/**
 * Helper module for creating, locking, writing and closing proper pidfiles.
 *
 * @module mkpidfile
 * @author Michael Welter <michael@yammm.com>
 * @copyright Copyright (c) 2017 Michael Welter <michael@yammm.com>
 * @license MIT
 * @example
 * require("mkpidfile")("/var/run/example.pid");
*/

"use strict";

const cluster = require("cluster");
const fs = require("fs");
const os = require("os");
const util = require("util");
const debuglog = util.debuglog("mkpidfile");

/**
 * Closes and removes a pidfile on process exit
 *
 * @param {string} pidfile - Path to the pidfile.
 * @param {number} fd - Integer file descriptor of the pidfile.
 * @private
 */
function onExit(pidfile, fd) {
    try {
        const stat = fs.fstatSync(fd);

        // skip deleting, we've already been deleted
        if (!stat.nlink) {
            debuglog("Our pidfile has already been deleted.");
            return;
        }

        // todo: fs.funlink
        fs.unlinkSync(pidfile);

        debuglog("Unlinked pidfile '%s' for process %d", pidfile, process.pid);
    } catch (ex) {
        debuglog(ex);
    }
}

/**
 * Opens (or creates) a file specified by the pidfile argument, locks it
 * and writes the current process PID into it. File is unlinked on normal
 * process termination.
 *
 * @param {string} pidfile - Path to the pidfile.
 */
module.exports = exports = function(pidfile) {
    if (!cluster.isMaster) {
        debuglog("Skipping pidfile creation since we are a worker process.");
        return;
    }

    if (!pidfile || "string" !== typeof pidfile) {
        debuglog("No pidfile path provided so we have nothing to do.");
        return;
    }

    debuglog("Creating pidfile '%s' for process %d", pidfile, process.pid);

    // get the file descriptor of the pidfile to be created or truncated
    const fd = fs.openSync(pidfile, "w+", 0o644);
    fs.writeSync(fd, `${process.pid}${os.EOL}`, 0, "ascii");

    // delete our pidfile on exit
    process.on("exit", () => {
        onExit(pidfile, fd);

        // close our file descriptor
        fs.closeSync(fd);
    });
};
'use strict';

var fs = require('fs'),
  Emitter = require('events').EventEmitter,
  emitter = new Emitter(),
  eventState = require('event-state'),

  dirTree = function (path, cb) {
    var tree = {},
      state;

    return buildBranch(path, tree);


    function buildBranch(path, branch) {

        fs.readdir(path, function (err, files) {

          if (err) {
            //Errors result in a false value in the tree.
            branch[path] = false;
            cb(err);
          } else {
            var newEvents = files.map(function (file) {
              return path + '/' + file;
            });

            if (!state) {
              // If this is the first iteration,
              // initialize the dynamic state machine (DSM).
              state = emitter.required(newEvents, function () {
                // Allow for multiple paradigms vis-a-vis callback and promises.

                // resolve the promise with the completed tree..
                cb(null, tree);
              });
            } else {
              // Add events to the DSM for the directory's children
              state.add(newEvents);
            }

            // Check each file descriptor to see if it's a directory.
            files.forEach(function (file) {
              var filePath = path + '/' + file;
              fs.stat(filePath, function (err, stats) {
                if (err) {
                  // Errors result in a false value in the tree
                  branch[file] = false;
                  emitter.emit(filePath, true);
                } else if (stats.isDirectory()) {

                  // Directories are object properties on the tree.
                  branch[file] = {};

                  // Recurse into the directory.
                  buildBranch(filePath, branch[file]);
                } else {

                  // If it's not a directory, it's a file.
                  // Files get a true value in the tree.
                  branch[file] = true;
                  emitter.emit(filePath, true);
                }
              });
            });
          }

          //Once we've read the directory, we can raise the event for the parent
          // directory and let it's children take care of themselves.
          emitter.emit(path, true);
        });
    }
  };

emitter.required = eventState;

module.exports = dirTree;
